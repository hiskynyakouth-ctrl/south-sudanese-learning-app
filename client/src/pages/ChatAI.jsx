import { useRef, useState } from "react";

// Local AI responses — works without a backend
const getAIResponse = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes("photosynthesis"))
    return "Photosynthesis is the process by which green plants use sunlight, water, and carbon dioxide to make food (glucose) and release oxygen. Formula: 6CO2 + 6H2O + light → C6H12O6 + 6O2.";
  if (m.includes("algebra") || m.includes("equation"))
    return "Algebra uses letters (variables) to represent unknown numbers. To solve an equation like 2x + 3 = 7, subtract 3 from both sides to get 2x = 4, then divide by 2 to get x = 2.";
  if (m.includes("cell"))
    return "A cell is the basic unit of life. Plant cells have a cell wall, chloroplasts, and a large vacuole. Animal cells have no cell wall. Both have a nucleus, cytoplasm, and cell membrane.";
  if (m.includes("newton") || m.includes("force") || m.includes("motion"))
    return "Newton's 3 Laws: 1) An object stays at rest or in motion unless acted on by a force. 2) Force = Mass × Acceleration (F=ma). 3) Every action has an equal and opposite reaction.";
  if (m.includes("atom") || m.includes("element") || m.includes("periodic"))
    return "An atom has a nucleus (protons + neutrons) surrounded by electrons. The Periodic Table organises elements by atomic number. Elements in the same group have similar chemical properties.";
  if (m.includes("geography") || m.includes("map") || m.includes("climate"))
    return "Geography studies the Earth's surface, climate, and human populations. Maps use scale, symbols, and grid references. Climate is the average weather of a place over 30+ years.";
  if (m.includes("history") || m.includes("colonial") || m.includes("africa"))
    return "Africa was colonised by European powers in the late 1800s (Berlin Conference 1884). Independence movements grew after WWII. South Sudan became independent on 9 July 2011, the world's newest nation.";
  if (m.includes("economics") || m.includes("demand") || m.includes("supply"))
    return "Demand is how much buyers want at a given price. Supply is how much sellers offer. When demand rises and supply stays the same, prices go up. This is the Law of Demand and Supply.";
  if (m.includes("summarize") || m.includes("summary") || m.includes("summarise"))
    return "To summarise a chapter: 1) Read the headings and subheadings first. 2) Note key definitions. 3) Write the main idea of each section in one sentence. 4) Review your notes before the quiz.";
  if (m.includes("exam") || m.includes("study") || m.includes("revision"))
    return "Top exam tips: 1) Study in short sessions (25 min on, 5 min break). 2) Use past papers. 3) Teach the topic to someone else. 4) Focus on topics you find hardest. 5) Get enough sleep before the exam.";
  if (m.includes("english") || m.includes("grammar") || m.includes("essay"))
    return "For essay writing: Start with an introduction that states your main point. Each paragraph should have one idea with evidence. End with a conclusion that summarises your argument. Check grammar and spelling.";
  if (m.includes("math") || m.includes("number") || m.includes("fraction"))
    return "Key maths tips: Always show your working. For fractions, find a common denominator before adding or subtracting. For percentages, divide by 100 then multiply. Practice daily for best results.";
  if (m.includes("biology") || m.includes("plant") || m.includes("animal"))
    return "Biology is the study of living things. Key topics: cell structure, genetics (DNA carries hereditary information), ecology (organisms and their environment), and human body systems.";
  if (m.includes("chemistry") || m.includes("reaction") || m.includes("bond"))
    return "Chemical reactions involve breaking and forming bonds. Acids have pH below 7, bases above 7, neutral is 7. Covalent bonds share electrons; ionic bonds transfer electrons between atoms.";
  if (m.includes("hello") || m.includes("hi") || m.includes("hey"))
    return "Hello! I am your AI Study Tutor for South Sudan Secondary School. Ask me to explain any topic, summarise a chapter, or help you prepare for your exams. What subject are you studying today?";
  return `Great question about "${msg.slice(0, 40)}...". This topic is part of the South Sudan secondary curriculum. Key points to study: 1) Review the definitions in your notes. 2) Look at worked examples. 3) Try the practice questions. 4) Use the quiz to test yourself. Ask me a more specific question and I will give you a detailed explanation!`;
};

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    { role: "assistant", text: "Hello! I am your AI Study Tutor. Ask me to explain any topic, summarise a chapter, or help you prepare for exams. Example: 'Explain photosynthesis' or 'How do I write a good essay?'" },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessage("");
    setLoading(true);
    setHistory((h) => [...h, { role: "user", text: userMsg }]);
    setTimeout(() => {
      const reply = getAIResponse(userMsg);
      setHistory((h) => [...h, { role: "assistant", text: reply }]);
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 600);
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
        <p>Get instant explanations, summaries, and study help for any subject — no internet needed.</p>
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
