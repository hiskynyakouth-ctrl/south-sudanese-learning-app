import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const SUBJECTS = [
  "Any Subject", "English", "Mathematics", "Biology", "Chemistry",
  "Physics", "History", "Geography", "Economics", "Agriculture",
  "CRE", "Computer Studies", "Citizenship", "Fine Art", "Accounting",
];

const MODES = [
  { key: "learn",    label: "📖 Learn",    desc: "Explain concepts clearly" },
  { key: "practice", label: "✍️ Practice",  desc: "Give practice exercises" },
  { key: "exam",     label: "🎯 Exam Prep", desc: "Focus on exam tips" },
];

export default function Chat() {
  const location = useLocation();
  const initSubject = location.state?.subject || "Any Subject";
  const initTopic   = location.state?.topic   || "";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hello! I'm your AI Tutor for South Sudan Secondary School.\n\nAsk me anything about your subjects — I can explain topics, give examples, help with exam prep, and more!\n\nWhat would you like to learn today?",
    },
  ]);
  const [input,   setInput]   = useState(initTopic);
  const [subject, setSubject] = useState(initSubject);
  const [mode,    setMode]    = useState("learn");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);
    try {
      const { data } = await api.post("/chat", {
        message: question,
        subject,
        mode,
        systemPrompt: `You are an expert AI tutor for South Sudan secondary school students (Senior 1–4).
Subject: ${subject}. Mode: ${mode}.
Explain clearly with examples. Be encouraging. Use step-by-step explanations.
Format responses with **bold** for key terms and numbered lists where helpful.`,
      });
      setMessages(prev => [...prev, { role: "assistant", text: data.response }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ I couldn't connect to the server right now. Please check your connection or try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    `Explain ${subject !== "Any Subject" ? subject + " — " : ""}photosynthesis`,
    "How do I solve quadratic equations?",
    "What are Newton's three laws?",
    "How to write a good essay introduction?",
    "Explain demand and supply",
  ];

  return (
    <div className="chat-shell">

      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <span style={{ fontSize: "1.8rem" }}>🤖</span>
          <div>
            <strong>AI Tutor</strong>
            <small>South Sudan Secondary · Senior 1–4</small>
          </div>
        </div>

        {/* Controls */}
        <div className="chat-controls">
          <select
            className="admin-select"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            aria-label="Select subject"
          >
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>

          <div className="chat-mode-tabs">
            {MODES.map(m => (
              <button
                key={m.key}
                className={`chat-mode-btn${mode === m.key ? " active" : ""}`}
                onClick={() => setMode(m.key)}
                title={m.desc}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.role === "assistant" && (
              <div className="chat-avatar">🤖</div>
            )}
            <div className="chat-text">
              {msg.text.split("\n").map((line, j) => {
                // Render **bold** markdown
                const parts = line.split(/\*\*(.+?)\*\*/g);
                return (
                  <p key={j} style={{ margin: "2px 0" }}>
                    {parts.map((part, k) =>
                      k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble assistant">
            <div className="chat-avatar">🤖</div>
            <div className="chat-text chat-typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions (only show when no user messages yet) */}
      {messages.length === 1 && (
        <div className="chat-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="chat-suggestion-btn" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Ask the AI tutor anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button
          className="primary-button chat-send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          {loading ? "⏳" : "➤"}
        </button>
      </div>
    </div>
  );
}
