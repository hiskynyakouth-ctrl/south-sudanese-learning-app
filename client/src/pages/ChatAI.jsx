import { useRef, useState } from "react";
import api from "../services/api";

// ── Study modes ──────────────────────────────────────────
const MODES = [
  { key: "learn",    label: "📖 Learn",       desc: "Explain topics clearly" },
  { key: "practice", label: "🧪 Practice",    desc: "Give me practice questions" },
  { key: "exam",     label: "📝 Exam Prep",   desc: "Help me prepare for exams" },
  { key: "simplify", label: "💡 Simplify",    desc: "Explain in simple words" },
];

const SUBJECTS = [
  "Any Subject","Mathematics","Biology","Chemistry","Physics",
  "English","History","Geography","Economics","CRE",
  "Citizenship","Computer Studies","Agriculture","Accounting",
  "English Literature","Fine Art","Additional Mathematics",
];

// ── Rich local AI engine ─────────────────────────────────
const LOCAL_KB = {
  // Biology
  photosynthesis: "🌿 **Photosynthesis** is the process by which green plants make food using sunlight.\n\n**Equation:** 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\n**Steps:**\n1. Chlorophyll in chloroplasts absorbs sunlight\n2. Water is split (photolysis) releasing oxygen\n3. CO₂ is fixed into glucose\n\n**Key points:** Occurs in chloroplasts. Requires light, water, CO₂. Produces glucose and oxygen.",
  "cell biology": "🔬 **Cell Biology**\n\n**Animal cell organelles:** Nucleus (controls cell), Mitochondria (energy/ATP), Ribosome (protein synthesis), Cell membrane (controls entry/exit)\n\n**Plant cell extras:** Cell wall (cellulose), Chloroplasts (photosynthesis), Large vacuole (water storage)\n\n**Key difference:** Plant cells have cell wall + chloroplasts; animal cells do not.",
  genetics: "🧬 **Genetics** is the study of heredity and variation.\n\n**Key terms:**\n- DNA: carries genetic information\n- Gene: section of DNA coding for a protein\n- Chromosome: coiled DNA strand\n- Allele: different forms of a gene\n- Dominant: allele that is always expressed\n- Recessive: allele only expressed when homozygous\n\n**Mendel's Laws:** Law of Segregation, Law of Independent Assortment",
  // Chemistry
  "atomic structure": "⚗️ **Atomic Structure**\n\n**Sub-atomic particles:**\n- Proton: +1 charge, in nucleus\n- Neutron: 0 charge, in nucleus\n- Electron: -1 charge, in shells\n\n**Key formulas:**\n- Atomic number (Z) = number of protons\n- Mass number (A) = protons + neutrons\n- Neutrons = A – Z\n\n**Electron shells:** 2, 8, 8, 18...\n\n**Example:** Sodium (Na): Z=11, A=23, config: 2,8,1",
  "periodic table": "📊 **The Periodic Table**\n\nElements arranged by increasing atomic number.\n\n**Groups (columns):** Elements with same number of valence electrons and similar properties\n- Group 1: Alkali metals (1 valence electron, very reactive)\n- Group 7: Halogens (7 valence electrons)\n- Group 0/8: Noble gases (full outer shell, unreactive)\n\n**Periods (rows):** Elements with same number of electron shells",
  "chemical bonding": "🔗 **Chemical Bonding**\n\n**Ionic bonding:** Transfer of electrons between metal and non-metal. Forms ions (Na⁺ Cl⁻). High melting point, conducts electricity when dissolved.\n\n**Covalent bonding:** Sharing of electrons between non-metals. Can be single (H₂), double (O₂), or triple (N₂) bonds.\n\n**Metallic bonding:** Sea of delocalised electrons. Explains conductivity and malleability of metals.",
  // Physics
  "newton": "⚡ **Newton's Laws of Motion**\n\n**1st Law (Inertia):** An object stays at rest or moves in a straight line unless acted on by a net force.\n\n**2nd Law:** F = ma (Force = mass × acceleration)\n- Unit of force: Newton (N)\n- 1N = force that gives 1kg an acceleration of 1m/s²\n\n**3rd Law:** Every action has an equal and opposite reaction.\n\n**Example:** F=ma → if m=5kg, a=3m/s², then F=15N",
  "mechanics": "⚡ **Mechanics & Motion**\n\n**Key equations:**\n- Speed = distance ÷ time\n- v = u + at\n- s = ut + ½at²\n- v² = u² + 2as\n- Weight W = mg (g = 10 m/s²)\n\n**Graphs:**\n- Distance-time: gradient = speed\n- Velocity-time: gradient = acceleration, area = displacement\n\n**Example:** Car from rest, a=4m/s², t=5s → v = 0 + 4×5 = 20 m/s",
  "electricity": "💡 **Electricity**\n\n**Ohm's Law:** V = IR (Voltage = Current × Resistance)\n\n**Series circuit:** Same current, voltages add up\n**Parallel circuit:** Same voltage, currents add up\n\n**Power:** P = IV = I²R = V²/R (unit: Watts)\n**Energy:** E = Pt (unit: Joules)\n\n**Example:** V=12V, R=4Ω → I = V/R = 12/4 = 3A",
  // Mathematics
  algebra: "📐 **Algebra**\n\n**Solving linear equations:**\nExample: 3x + 7 = 22 → 3x = 15 → x = 5\n\n**Quadratic formula:** x = (–b ± √(b²–4ac)) / 2a\n\n**Factorisation:** x² + 5x + 6 = (x+2)(x+3)\n\n**Simultaneous equations:**\nx + y = 7 and x – y = 3 → add: 2x = 10 → x=5, y=2\n\n**Key rule:** Whatever you do to one side, do to the other.",
  "quadratic": "📐 **Quadratic Equations** (ax² + bx + c = 0)\n\n**Methods:**\n1. Factorisation: x² – 5x + 6 = (x–2)(x–3) = 0 → x=2 or x=3\n2. Quadratic formula: x = (–b ± √(b²–4ac)) / 2a\n3. Completing the square\n\n**Discriminant (b²–4ac):**\n- > 0: two real roots\n- = 0: one repeated root\n- < 0: no real roots",
  trigonometry: "📐 **Trigonometry**\n\n**SOH CAH TOA:**\n- sin θ = Opposite/Hypotenuse\n- cos θ = Adjacent/Hypotenuse\n- tan θ = Opposite/Adjacent\n\n**Key angles:**\n- sin 30° = 0.5, cos 60° = 0.5\n- sin 45° = cos 45° = √2/2\n- sin 90° = 1, cos 90° = 0\n\n**Pythagoras:** a² + b² = c²",
  // English
  essay: "📝 **Essay Writing Structure**\n\n**Introduction:** Hook → Background → Thesis statement\n\n**Body paragraphs (PEEL):**\n- Point (topic sentence)\n- Evidence (facts/examples)\n- Explanation (analysis)\n- Link (connect to thesis)\n\n**Conclusion:** Restate thesis → Summarise → Final thought\n\n**Transition words:** Furthermore, However, Therefore, In addition, On the other hand",
  comprehension: "📖 **Reading Comprehension Tips**\n\n1. Read the passage twice (first for general meaning, then for details)\n2. Identify the main idea (usually in the topic sentence)\n3. Look for key words in questions\n4. Use context clues for unknown words\n5. Support all answers with evidence from the text\n6. Distinguish fact from opinion\n7. Identify the author's purpose and tone",
  // History
  "colonial": "🏛️ **The Colonial Era in Africa**\n\nEuropean colonisation of Africa accelerated after the **Berlin Conference (1884–85)** where European powers divided Africa without African representation.\n\n**Effects of colonisation:**\n- Disruption of traditional governance\n- Extraction of natural resources\n- Introduction of European languages and religion\n- Arbitrary borders dividing ethnic groups\n\n**South Sudan** was colonised by Britain as part of Anglo-Egyptian Sudan.",
  "south sudan": "🇸🇸 **South Sudan History**\n\n- Part of Sudan under British-Egyptian rule (1899–1956)\n- Sudan gained independence in 1956\n- First Civil War (1955–1972)\n- Second Civil War (1983–2005)\n- Comprehensive Peace Agreement (CPA) signed 2005\n- Independence referendum 2011: 98.83% voted YES\n- **South Sudan became independent on 9 July 2011** — the world's newest nation\n- Capital: Juba",
  // Geography
  "maps": "🗺️ **Maps & Map Reading**\n\n**Scale:** 1:50,000 means 1cm = 500m on ground\n**Contour lines:** Join points of equal elevation\n- Close together = steep slope\n- Far apart = gentle slope\n\n**Grid references:** Read eastings (→) then northings (↑)\n**Compass bearings:** N=000°, E=090°, S=180°, W=270°\n\n**Types of maps:** Topographic, Political, Physical, Thematic",
  // Economics
  "demand": "💰 **Demand & Supply**\n\n**Law of Demand:** As price rises, quantity demanded falls (inverse relationship)\n**Law of Supply:** As price rises, quantity supplied rises (direct relationship)\n\n**Equilibrium:** Where demand = supply (market clears)\n**Surplus:** Supply > Demand (price too high)\n**Shortage:** Demand > Supply (price too low)\n\n**Shifts in demand:** Income, tastes, prices of substitutes/complements",
  "economics": "💰 **Basic Economics**\n\n**Scarcity:** Limited resources vs unlimited wants — the central economic problem\n**Opportunity cost:** Value of the next best alternative given up\n**Factors of production:** Land, Labour, Capital, Entrepreneurship\n\n**Economic systems:**\n- Market economy: price mechanism allocates resources\n- Command economy: government controls production\n- Mixed economy: combination of both",
};

const getLocalResponse = (msg, mode, subject) => {
  const m = msg.toLowerCase();

  // Search knowledge base
  for (const [key, value] of Object.entries(LOCAL_KB)) {
    if (m.includes(key)) {
      let response = value;
      if (mode === "practice") {
        response += "\n\n**Practice Question:** Based on the above, can you explain this concept in your own words? Try writing a 3-sentence summary.";
      } else if (mode === "exam") {
        response += "\n\n**Exam Tip:** This topic commonly appears in SSSCE exams. Make sure you can define key terms, state formulas, and apply them to examples.";
      } else if (mode === "simplify") {
        response = "**Simple explanation:** " + response.split("\n")[0].replace(/\*\*/g, "");
      }
      return response;
    }
  }

  // Subject-aware fallback
  if (subject && subject !== "Any Subject") {
    return `I understand you're asking about **${subject}**. This is a great topic to study!\n\nFor the best answer, try asking a more specific question like:\n- "Explain [specific topic] in ${subject}"\n- "What is the formula for [concept]?"\n- "Give me practice questions on [topic]"\n\nOr use the quick prompts below to get started.`;
  }

  return null;
};

const formatMessage = (text) => {
  // Convert **bold** and line breaks to JSX
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        <br />
      </span>
    );
  });
};

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("learn");
  const [subject, setSubject] = useState("Any Subject");
  const [history, setHistory] = useState([
    { role: "assistant", text: "Hello! I am your AI Study Tutor for South Sudan Secondary School 🇸🇸\n\nI can help you with **any subject** — Biology, Chemistry, Physics, Mathematics, English, History, Geography, Economics, and more.\n\nChoose a **study mode** and **subject** above, then ask me anything!" },
  ]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const scrollDown = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

  const sendMessage = async (overrideMsg) => {
    const userMsg = (overrideMsg || message).trim();
    if (!userMsg && !imageFile) return;
    setMessage("");
    setLoading(true);

    const displayMsg = imageFile ? `${userMsg} [Image attached: ${imageFile.name}]` : userMsg;
    setHistory((h) => [...h, { role: "user", text: displayMsg }]);
    setImageFile(null);

    try {
      // 1. Try local knowledge base first
      const localReply = getLocalResponse(userMsg, mode, subject);
      if (localReply) {
        setHistory((h) => [...h, { role: "assistant", text: localReply }]);
        scrollDown();
        setLoading(false);
        return;
      }

      // 2. Try backend (OpenAI or fallback)
      const systemPrompt = `You are an expert AI tutor for South Sudan secondary school students (Senior 1-4). 
Mode: ${mode}. Subject focus: ${subject}.
${mode === "learn" ? "Explain clearly with examples." : ""}
${mode === "practice" ? "Give practice questions and worked examples." : ""}
${mode === "exam" ? "Focus on exam technique, key points, and common mistakes." : ""}
${mode === "simplify" ? "Use very simple language a 14-year-old can understand." : ""}
Always relate answers to the South Sudan curriculum. Be encouraging and supportive.`;

      const { data } = await api.post("/chat", {
        message: userMsg,
        systemPrompt,
        subject,
        mode,
      });
      setHistory((h) => [...h, { role: "assistant", text: data.response || data.reply || "I received your question but could not generate a response. Please try again." }]);
    } catch {
      // 3. Smart offline fallback
      const fallback = generateFallback(userMsg, mode, subject);
      setHistory((h) => [...h, { role: "assistant", text: fallback }]);
    } finally {
      setLoading(false);
      scrollDown();
    }
  };

  const generateFallback = (msg, mode, subject) => {
    const m = msg.toLowerCase();
    if (m.includes("exam") || m.includes("study") || m.includes("revision"))
      return "📚 **Exam Study Tips:**\n\n1. Study in 25-minute sessions with 5-minute breaks (Pomodoro technique)\n2. Write key definitions from memory\n3. Practice past papers under timed conditions\n4. Teach the topic to someone else\n5. Review your notes the night before\n6. Get enough sleep — your brain consolidates memory during sleep!";
    if (m.includes("summarize") || m.includes("summary") || m.includes("summarise"))
      return `📋 **How to Summarise ${subject !== "Any Subject" ? subject : "a topic"}:**\n\n1. Read the full notes once\n2. Identify the 3-5 most important points\n3. Write each point in ONE sentence\n4. Add key formulas or definitions\n5. Review your summary the next day\n\nTip: Use the Notes tab in each module for structured summaries!`;
    return `I'm currently working offline, but I can still help!\n\nFor **${subject !== "Any Subject" ? subject : "your question"}**, try:\n- Opening the module notes for detailed explanations\n- Using the Q&A tab for discussion questions\n- Taking the quiz to test your knowledge\n- Watching the YouTube tutorial video\n\nOr rephrase your question and I'll do my best to answer!`;
  };

  // Voice input
  const startVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser. Please use Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    setListening(true);
    recognition.start();
    recognition.onresult = (e) => {
      setMessage(e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickPrompts = {
    learn:    ["Explain photosynthesis","What is Newton's Second Law?","Explain the periodic table","What is osmosis?","Explain demand and supply","What is the cell membrane?"],
    practice: ["Give me 3 practice questions on algebra","Test me on cell biology","Practice questions on Newton's laws","Give me geography map reading questions","Test me on essay writing"],
    exam:     ["What topics come up most in Physics exams?","How do I answer a Biology essay question?","Key formulas I need for Mathematics","Common mistakes in Chemistry exams","How to structure a History answer"],
    simplify: ["Explain photosynthesis simply","What is an atom in simple words?","Explain democracy simply","What is inflation in simple words?","Explain DNA simply"],
  };

  return (
    <div className="ai-shell">

      {/* Header */}
      <div className="ai-header">
        <span className="eyebrow">South Sudan E-Learning · AI Study Assistant</span>
        <h1>🤖 AI Tutor</h1>
        <p>Ask anything about your subjects. Get instant explanations, practice questions, and exam help.</p>
      </div>

      {/* Mode selector */}
      <div className="ai-modes">
        {MODES.map((m) => (
          <button key={m.key}
            className={`ai-mode-btn${mode === m.key ? " active" : ""}`}
            onClick={() => setMode(m.key)}>
            <span>{m.label}</span>
            <small>{m.desc}</small>
          </button>
        ))}
      </div>

      {/* Subject selector */}
      <div className="ai-subject-row">
        <span className="ai-subject-label">Subject:</span>
        <div className="filter-row" style={{ flexWrap: "wrap" }}>
          {SUBJECTS.map((s) => (
            <button key={s}
              className={`filter-pill${subject === s ? " active" : ""}`}
              onClick={() => setSubject(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quick prompts */}
      <div className="ai-quick-row">
        {(quickPrompts[mode] || quickPrompts.learn).map((p) => (
          <button key={p} className="ai-quick-btn" onClick={() => sendMessage(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="ai-chat-shell">
        <div className="chat-history">
          {history.map((item, i) => (
            <article key={i} className={`chat-bubble ${item.role}`}>
              <strong>{item.role === "user" ? "You" : "🤖 AI Tutor"}</strong>
              <div style={{ margin: "6px 0 0", lineHeight: 1.8 }}>
                {item.role === "assistant" ? formatMessage(item.text) : item.text}
              </div>
            </article>
          ))}
          {loading && (
            <article className="chat-bubble assistant">
              <strong>🤖 AI Tutor</strong>
              <div className="ai-typing">
                <span /><span /><span />
              </div>
            </article>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Image preview */}
        {imageFile && (
          <div className="ai-image-preview">
            📎 {imageFile.name}
            <button onClick={() => setImageFile(null)}>✕</button>
          </div>
        )}

        {/* Input row */}
        <div className="ai-input-row">
          <button className={`ai-voice-btn${listening ? " listening" : ""}`}
            onClick={startVoice} title="Voice input">
            {listening ? "🔴" : "🎤"}
          </button>
          <button className="ai-image-btn"
            onClick={() => fileRef.current?.click()} title="Upload image question">
            📷
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => setImageFile(e.target.files[0])} />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask about ${subject !== "Any Subject" ? subject : "any subject"}... (Enter to send)`}
            rows={2}
            className="ai-textarea"
          />
          <button className="primary-button ai-send-btn"
            onClick={() => sendMessage()} disabled={loading}>
            {loading ? "..." : "Send →"}
          </button>
        </div>
      </div>
    </div>
  );
}
