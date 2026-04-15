import { useRef, useState } from "react";
import api from "../services/api";

// Local AI responses — fallback if backend is offline or for quick answers
const getLocalResponse = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes("photosynthesis"))
    return "Photosynthesis is the process by which green plants use sunlight, water, and carbon dioxide to make food (glucose) and release oxygen. Formula: 6CO2 + 6H2O + light → C6H12O6 + 6O2.";
  if (m.includes("algebra") || m.includes("equation"))
    return "Algebra uses letters (variables) to represent unknown numbers. To solve an equation like 2x + 3 = 7, subtract 3 from both sides to get 2x = 4, then divide by 2 to get x = 2.";
  if (m.includes("cell"))
    return "A cell is the basic unit of life. Plant cells have a cell wall, chloroplasts, and a large vacuole. Animal cells have no cell wall. Both have a nucleus, cytoplasm, and cell membrane.";
  if (m.includes("newton") || m.includes("force") || m.includes("motion"))
    return "Newton's 3 Laws: 1) An object stays at rest or in motion unless acted on by a force. 2) Force = Mass × Acceleration (F=ma). 3) Every action has an equal and opposite reaction.";
  if (m.includes("hello") || m.includes("hi") || m.includes("hey"))
    return "Hello! I am your AI Study Tutor for South Sudan Secondary School. Ask me to explain any topic, summarise a chapter, or help you prepare for your exams. What subject are you studying today?";
  return null; // Fallback to backend
};

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    { role: "assistant", text: "Hello! I am your AI Study Tutor. Ask me to explain any topic, summarise a chapter, or help you prepare for exams. Example: 'Explain photosynthesis' or 'How do I write a good essay?'" },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessage("");
    setLoading(true);
    setHistory((h) => [...h, { role: "user", text: userMsg }]);

    try {
      // 1. Try local response first for common questions
      const localReply = getLocalResponse(userMsg);
      if (localReply) {
        setHistory((h) => [...h, { role: "assistant", text: localReply }]);
      } else {
        // 2. Fallback to Backend AI
        const { data } = await api.post("/chat", { message: userMsg });
        setHistory((h) => [...h, { role: "assistant", text: data.response }]);
      }
    } catch (error) {
      setHistory((h) => [...h, { role: "assistant", text: "I'm having trouble connecting to my brain right now. Please try again later!" }]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickPrompts = [
    "Explain photosynthesis", "Newton's laws of motion", "How to write an essay",
    "What is demand and supply?", "Explain the periodic table", "Study tips for exams",
  ];

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <span className="eyebrow">AI Study Assistant</span>
        <h1>Ask the AI Tutor 🤖</h1>
        <p>Get instant explanations, summaries, and study help for any subject.</p>
      </section>

      <div className="ai-quick-row">
        {quickPrompts.map((p) => (
          <button key={p} className="ai-quick-btn" onClick={() => { setMessage(p); }}>
            {p}
          </button>
        ))}
      </div>

      <section className="chat-shell">
        <div className="chat-history">
          {history.map((item, i) => (
            <article key={i} className={`chat-bubble ${item.role}`}>
              <strong>{item.role === "user" ? "You" : "🤖 AI Tutor"}</strong>
              <p style={{ margin: "6px 0 0", lineHeight: 1.7 }}>{item.text}</p>
            </article>
          ))}
          {loading && (
            <article className="chat-bubble assistant">
              <strong>🤖 AI Tutor</strong>
              <p style={{ margin: "6px 0 0" }}>Thinking...</p>
            </article>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-row">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything... e.g. Explain photosynthesis in simple words"
            rows={3}
          />
          <button type="button" className="primary-button" onClick={sendMessage} disabled={loading}>
            {loading ? "Thinking..." : "Send →"}
          </button>
        </div>
      </section>
    </div>
  );
}
