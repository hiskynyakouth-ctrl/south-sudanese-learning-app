import { useState } from "react";
import api from "../services/api";

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    {
      role: "assistant",
      text: "Ask me to explain a topic, summarize a chapter, or simplify a hard concept for revision.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const nextMessage = message.trim();
    setHistory((current) => [...current, { role: "user", text: nextMessage }]);
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const { data } = await api.post("/chat", { message: nextMessage });
      setHistory((current) => [...current, { role: "assistant", text: data.response }]);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to get a reply from the AI tutor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <span className="eyebrow">AI assistant</span>
        <h1>Study with guided explanations</h1>
        <p>Use the tutor for summaries, simple explanations, and revision support while you study.</p>
      </section>

      <section className="chat-shell">
        <div className="chat-history">
          {history.map((item, index) => (
            <article key={`${item.role}-${index}`} className={`chat-bubble ${item.role}`}>
              <strong>{item.role === "user" ? "You" : "AI Tutor"}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        {error ? <div className="message-card error">{error}</div> : null}

        <div className="chat-input-row">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Example: Explain photosynthesis in simple words for Senior 1."
            rows={4}
          />
          <button type="button" className="primary-button" onClick={sendMessage} disabled={loading}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>
      </section>
    </div>
  );
}
