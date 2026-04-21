import { useEffect, useRef, useState } from "react";
import api from "../services/api";

// ── Rich local knowledge base ─────────────────────────────
const LOCAL_KB = {
  photosynthesis: "🌿 **Photosynthesis** is how green plants make food using sunlight.\n\n**Equation:** 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\n**Steps:**\n1. Chlorophyll absorbs sunlight\n2. Water splits (photolysis) → releases O₂\n3. CO₂ fixed into glucose\n\n**Key:** Occurs in chloroplasts. Needs light, water, CO₂.",
  "cell biology": "🔬 **Cell Biology**\n\n**Animal cell:** Nucleus, Mitochondria, Ribosome, Cell membrane, Cytoplasm\n**Plant cell extras:** Cell wall (cellulose), Chloroplasts, Large vacuole\n\n**Osmosis:** Water moves from dilute → concentrated through semi-permeable membrane\n**Diffusion:** High → low concentration, no energy needed\n**Active transport:** Against gradient, needs ATP",
  "atomic structure": "⚗️ **Atomic Structure**\n\n- Proton: +1 charge, in nucleus\n- Neutron: 0 charge, in nucleus  \n- Electron: -1 charge, in shells\n\n**Formulas:** Atomic number (Z) = protons | Mass number (A) = protons + neutrons | Neutrons = A – Z\n\n**Electron shells:** 2, 8, 8, 18...\n\n**Example:** Na (Z=11, A=23): 11p, 12n, config 2,8,1",
  newton: "⚡ **Newton's Laws**\n\n**1st (Inertia):** Object stays at rest/motion unless net force acts\n**2nd:** F = ma (Force = mass × acceleration)\n**3rd:** Every action has equal & opposite reaction\n\n**Key equations:**\n- v = u + at\n- s = ut + ½at²\n- v² = u² + 2as\n- W = mg (g = 10 m/s²)",
  algebra: "📐 **Algebra**\n\n**Linear:** 3x + 7 = 22 → 3x = 15 → x = 5\n**Quadratic formula:** x = (–b ± √(b²–4ac)) / 2a\n**Factorisation:** x² + 5x + 6 = (x+2)(x+3)\n**Simultaneous:** x+y=7, x–y=3 → add: 2x=10 → x=5, y=2",
  essay: "📝 **Essay Writing**\n\n**Structure:** Introduction → Body (3+ paragraphs) → Conclusion\n**PEEL:** Point → Evidence → Explanation → Link\n**Transitions:** Furthermore, However, Therefore, In addition\n**Thesis:** State your main argument clearly in the introduction",
  "south sudan": "🇸🇸 **South Sudan**\n\n- Independence: **9 July 2011** (world's newest nation)\n- Capital: Juba\n- Civil wars: 1955–72, 1983–2005\n- CPA signed: 2005\n- Independence vote: 98.83% YES\n- Nilotic peoples: Dinka, Nuer, Shilluk, Bari, Zande",
  economics: "💰 **Economics**\n\n**Scarcity:** Limited resources vs unlimited wants\n**Opportunity cost:** Value of next best alternative given up\n**Law of Demand:** Price↑ → Quantity demanded↓\n**Law of Supply:** Price↑ → Quantity supplied↑\n**Equilibrium:** Where demand = supply",
  geography: "🌍 **Geography**\n\n**Map scale 1:50,000:** 1cm = 500m\n**Contour lines:** Close = steep, Far = gentle slope\n**Grid references:** Eastings (→) then Northings (↑)\n**Bearings:** N=000°, E=090°, S=180°, W=270°",
  history: "🏛️ **African History**\n\n**Pre-colonial:** Mali Empire (gold/salt), Great Zimbabwe, Kingdom of Kush\n**Berlin Conference 1884–85:** Europe divided Africa\n**Mansa Musa 1324:** Richest man in history, pilgrimage to Mecca\n**Independence movements:** 1950s–60s across Africa",
};

const getLocalReply = (msg) => {
  const m = msg.toLowerCase();
  for (const [key, val] of Object.entries(LOCAL_KB)) {
    if (m.includes(key)) return val;
  }
  // Generic helpful response
  if (m.includes("exam") || m.includes("study") || m.includes("revision"))
    return "📚 **Exam Tips:**\n\n1. Study in 25-min sessions (Pomodoro)\n2. Write key definitions from memory\n3. Practice past papers under timed conditions\n4. Teach the topic to someone else\n5. Review notes the night before\n6. Sleep well — your brain consolidates memory during sleep!";
  if (m.includes("hello") || m.includes("hi") || m.includes("hey"))
    return "Hello! 👋 I'm your AI Study Tutor for South Sudan Secondary School.\n\nI can help you with **any subject** — Biology, Chemistry, Physics, Mathematics, English, History, Geography, Economics, and more.\n\nAsk me anything, upload a file, or use the microphone to speak your question!";
  return null;
};

const formatText = (text) =>
  text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        <br />
      </span>
    );
  });

const QUICK = [
  "Explain photosynthesis", "Newton's laws of motion",
  "How to write a good essay", "What is demand and supply?",
  "Explain atomic structure", "South Sudan independence",
  "Algebra quadratic formula", "Study tips for exams",
];

export default function ChatAI() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! 👋 I'm your AI Study Tutor.\n\nAsk me anything about your subjects — Biology, Chemistry, Physics, Mathematics, English, History, Geography, Economics, and more.\n\nYou can also **upload a file** (PDF, PPT, image) or use the **microphone** to speak your question!", files: [] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const bottomRef = useRef();
  const fileRef = useRef();
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text && attachments.length === 0) return;
    setInput("");

    const userMsg = { role: "user", text, files: attachments };
    setMessages(h => [...h, userMsg]);
    setAttachments([]);
    setLoading(true);

    try {
      // 1. Try local KB
      const local = getLocalReply(text);
      if (local && attachments.length === 0) {
        await new Promise(r => setTimeout(r, 400));
        setMessages(h => [...h, { role: "assistant", text: local, files: [] }]);
        setLoading(false);
        return;
      }

      // 2. Try backend (OpenAI or smart fallback)
      const { data } = await api.post("/chat", {
        message: text || "Please analyse the uploaded file and explain its content.",
        subject: "General",
        mode: "learn",
      });
      setMessages(h => [...h, { role: "assistant", text: data.response || data.reply || "I received your message but couldn't generate a response. Please try again.", files: [] }]);
    } catch {
      // 3. Smart offline fallback
      const fallback = text
        ? `I understand you're asking about **"${text}"**.\n\nHere's how to approach this:\n\n1. **Define** the key terms\n2. **Explain** the main concept with an example\n3. **Apply** it to a real-world situation\n4. **Review** using the module notes and quiz\n\nFor a detailed answer, try asking a more specific question like:\n- "Explain ${text} in simple words"\n- "Give me an example of ${text}"\n- "What are the key points about ${text}?"\n\n💡 Add your OpenAI API key to server/.env as OPENAI_API_KEY=sk-... for full AI responses.`
        : "I received your file! To analyse it, please also type a question about it, for example:\n- 'Summarise this document'\n- 'What are the key points?'\n- 'Explain the main topic'";
      setMessages(h => [...h, { role: "assistant", text: fallback, files: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // ── Microphone ────────────────────────────────────────────
  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input is not supported in your browser. Please use Chrome."); return; }
    const r = new SR();
    r.lang = "en-US";
    r.continuous = false;
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recognitionRef.current = r;
    r.start();
  };

  // ── File upload ───────────────────────────────────────────
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const processed = files.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
      url: URL.createObjectURL(f),
      isImage: f.type.startsWith("image/"),
    }));
    setAttachments(prev => [...prev, ...processed]);
    e.target.value = "";
  };

  const removeAttachment = (i) => setAttachments(a => a.filter((_, idx) => idx !== i));

  return (
    <div className="gpt-shell">

      {/* Header */}
      <div className="gpt-header">
        <div className="gpt-header-left">
          <div className="gpt-avatar">🤖</div>
          <div>
            <h1>AI Study Tutor</h1>
            <span className="gpt-status">● Online · South Sudan Curriculum</span>
          </div>
        </div>
        <button className="gpt-clear-btn" onClick={() => setMessages([{
          role: "assistant",
          text: "Chat cleared. Ask me anything! 👋",
          files: [],
        }])}>
          🗑️ Clear
        </button>
      </div>

      {/* Quick prompts */}
      <div className="gpt-quick-row">
        {QUICK.map(q => (
          <button key={q} className="gpt-quick-chip" onClick={() => send(q)}>{q}</button>
        ))}
      </div>

      {/* Messages */}
      <div className="gpt-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`gpt-msg ${msg.role}`}>
            <div className="gpt-msg-avatar">
              {msg.role === "assistant" ? "🤖" : "👤"}
            </div>
            <div className="gpt-msg-body">
              {msg.files?.length > 0 && (
                <div className="gpt-msg-files">
                  {msg.files.map((f, fi) => (
                    <div key={fi} className="gpt-file-chip">
                      {f.isImage
                        ? <img src={f.url} alt={f.name} className="gpt-file-img" />
                        : <span>📎 {f.name}</span>}
                    </div>
                  ))}
                </div>
              )}
              {msg.text && (
                <div className="gpt-msg-text">
                  {msg.role === "assistant" ? formatText(msg.text) : msg.text}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="gpt-msg assistant">
            <div className="gpt-msg-avatar">🤖</div>
            <div className="gpt-msg-body">
              <div className="gpt-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="gpt-attachments">
          {attachments.map((f, i) => (
            <div key={i} className="gpt-attach-chip">
              {f.isImage
                ? <img src={f.url} alt={f.name} style={{ width:32, height:32, objectFit:"cover", borderRadius:6 }} />
                : <span>📎</span>}
              <span>{f.name.length > 20 ? f.name.slice(0,20)+"..." : f.name}</span>
              <button onClick={() => removeAttachment(i)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="gpt-input-area">
        <div className="gpt-input-box">
          <textarea
            className="gpt-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your subjects... (Enter to send, Shift+Enter for new line)"
            rows={1}
            style={{ height: "auto" }}
            onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; }}
          />
          <div className="gpt-input-actions">
            {/* File upload */}
            <button className="gpt-icon-btn" title="Upload file (PDF, PPT, image)"
              onClick={() => fileRef.current?.click()}>
              📎
            </button>
            <input ref={fileRef} type="file" multiple
              accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,image/*"
              style={{ display:"none" }} onChange={handleFiles} />

            {/* Microphone */}
            <button
              className={`gpt-icon-btn mic${listening ? " active" : ""}`}
              title={listening ? "Stop listening" : "Voice input"}
              onClick={toggleMic}>
              {listening ? "🔴" : "🎤"}
            </button>

            {/* Send */}
            <button className="gpt-send-btn" onClick={() => send()} disabled={loading || (!input.trim() && attachments.length === 0)}>
              {loading ? "..." : "↑"}
            </button>
          </div>
        </div>
        <p className="gpt-hint">
          Supports text, voice 🎤, images 🖼️, PDFs 📄, PPT 📊 · Press Enter to send
        </p>
      </div>
    </div>
  );
}
