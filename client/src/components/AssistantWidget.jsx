import { useCallback, useEffect, useRef, useState } from "react";

// ── Pattern-matched responses ────────────────────────────
const RESPONSES = {
  register: {
    text: "✨ **Creating your account is easy!**\n\n1️⃣ Click **Get Started Free** on the home page\n2️⃣ Enter your **full name**\n3️⃣ Enter your **email address**\n4️⃣ Create a **secure password**\n5️⃣ Click **Create Account**\n\n🎉 That's it! Your learning journey begins immediately with a **30-day free trial**.",
    chips: ["How do I log in?", "What courses are available?", "How do I pay?", "Main menu"],
  },
  login: {
    text: "🔐 **Logging in is simple!**\n\n1️⃣ Go to the **Login** page\n2️⃣ Enter your **email address**\n3️⃣ Enter your **password**\n4️⃣ Click **Sign In**\n\n✅ Welcome back! You'll continue right where you left off.\n\n💡 Forgot your password? Use the **Forgot Password** link on the login page.",
    chips: ["I forgot my password", "How do I register?", "What courses are available?", "Main menu"],
  },
  password: {
    text: "🔑 **Forgot your password? No problem!**\n\n1️⃣ Go to the **Login** page\n2️⃣ Click **Forgot Password?**\n3️⃣ Enter your **email** or **phone number**\n4️⃣ Enter the **6-digit code** you receive\n5️⃣ Set your **new password**\n\n✅ You can also reset via **SMS** if you registered with a phone number.",
    chips: ["How do I log in?", "How do I register?", "Main menu"],
  },
  courses: {
    text: "📚 **Here's what you can study on the platform!**\n\n🎓 **Senior 1 & 2** — 15 core subjects\n🔬 **Senior 3 & 4** — Natural Sciences stream\n📖 **Senior 3 & 4** — Social Sciences stream\n\n**Each subject includes:**\n• 📖 Full Notes\n• 📝 Quizzes\n• 📚 Textbooks\n• 📄 Past Papers\n• 🎥 YouTube Videos\n\nAll aligned with the **South Sudan Ministry of Education** curriculum!",
    chips: ["How do I pay?", "How do I navigate?", "How do I register?", "Main menu"],
  },
  payment: {
    text: "💳 **Here's how to subscribe!**\n\n1️⃣ Go to the **Subscribe** page from the menu\n2️⃣ Choose your **country** (Ethiopia, Kenya, Uganda, South Sudan, Egypt, Sudan, or Western World)\n3️⃣ Select a **payment method** and copy the details\n4️⃣ Make the payment\n5️⃣ Send **proof of payment** to: thiyangkoang77@gmail.com\n\n✅ After verification, your subscription will be **activated by the admin**.\n\n⏱️ New users get a **30-day free trial** — no payment needed to start!",
    chips: ["How do I register?", "What courses are available?", "Main menu"],
  },
  profile: {
    text: "👤 **Managing your profile is easy!**\n\n• Click your **avatar** in the top-right corner\n• Select **Profile** from the menu\n• Update your **name** or **password**\n• Add a **profile picture** (up to 2MB)\n\n💡 Your quiz results and progress are also shown on your profile page.",
    chips: ["How do I change my password?", "What are notifications?", "Main menu"],
  },
  notifications: {
    text: "🔔 **Notifications keep you informed!**\n\nYou'll receive notifications for:\n• ✅ Quiz results and scores\n• 📢 Platform announcements\n• 🎓 Learning reminders\n• 📤 Upload updates\n\nClick the **🔔 bell icon** in the top navigation to view all your notifications. You can mark them as read or clear them all.",
    chips: ["How do I manage my profile?", "What courses are available?", "Main menu"],
  },
  navigate: {
    text: "🗺️ **Here's a quick map of the platform!**\n\n🏠 **Home** — Welcome page & class selector\n📘 **Senior 1–4** — Browse subjects by class\n📚 **Textbooks** — Official PDF textbooks\n📄 **Past Papers** — Filter by grade & year\n⭐ **Subscribe** — View plans & pricing\n👤 **Profile** — Your account & quiz history\n🔔 **Notifications** — Updates & alerts\n🔍 **Search** — Find subjects & modules fast",
    chips: ["What courses are available?", "How do I register?", "How do I pay?", "Main menu"],
  },
  about: {
    text: "🌍 **About South Sudan E-Learning**\n\nWe are a learning platform created specifically for **South Sudan secondary school students**.\n\n🎯 **Mission:** Make learning accessible, engaging, and empowering for everyone.\n\n📚 We cover **Senior 1 to Senior 4** following the official South Sudan Ministry of Education curriculum.\n\n✨ Built by **Thiyang Koang** — reaching students across South Sudan, Ethiopia, Kenya, Uganda, Egypt, Sudan, and beyond.",
    chips: ["What courses are available?", "How do I register?", "How do I navigate?", "Main menu"],
  },
  trial: {
    text: "🎁 **Free Trial — 30 Days!**\n\nEvery new account comes with a **30-day free trial** — no payment required!\n\n✅ Full access to all subjects, notes, quizzes, textbooks, and past papers during your trial.\n\n⏰ After 30 days, subscribe to continue learning. Choose from plans for **Ethiopia, Kenya, Uganda, South Sudan, Egypt, Sudan**, or **Western World**.",
    chips: ["How do I pay?", "How do I register?", "What courses are available?", "Main menu"],
  },
  fallback: {
    text: "😊 I'm here to help with the **South Sudan E-Learning platform**!\n\nI can answer questions about:\n• 📝 How to register or log in\n• 📚 Available courses and subjects\n• 💳 Payments and subscriptions\n• 👤 Your profile and settings\n• 🔔 Notifications\n• 🗺️ Navigating the platform\n\nWhat would you like to know? 👇",
    chips: ["How do I register?", "What courses are available?", "How do I pay?", "How do I navigate?"],
  },
};

const MAIN_MENU_CHIPS = [
  "How do I register?",
  "How do I log in?",
  "What courses are available?",
  "How do I pay?",
  "Help me navigate",
];

const GREETING = {
  text: "Hello and welcome! 👋😊\n\nI'm your friendly learning companion for the **South Sudan E-Learning App**. I'm here to help you every step of the way!\n\n💙 Ask me anything about the platform — registration, courses, payments, navigation, and more.",
  chips: MAIN_MENU_CHIPS,
};

function matchResponse(input) {
  const t = input.toLowerCase();
  if (/register|sign.?up|create.?account|new.?account|join/.test(t))        return "register";
  if (/forgot|reset|lost.?pass/.test(t))                                     return "password";
  if (/log.?in|sign.?in|login|signin|password/.test(t))                     return "login";
  if (/course|subject|note|textbook|past.?paper|quiz|senior|learn|study/.test(t)) return "courses";
  if (/pay|payment|purchase|unlock|subscribe|subscription|plan|price|cost/.test(t)) return "payment";
  if (/profile|account.?setting|personal|update.?name|avatar|picture/.test(t)) return "profile";
  if (/notif|update|announcement|alert|bell/.test(t))                        return "notifications";
  if (/navigat|find|where|how.?to.?use|menu|go.?to/.test(t))               return "navigate";
  if (/what.?is|about|platform|mission|purpose|tell.?me/.test(t))          return "about";
  if (/trial|free|days|start/.test(t))                                      return "trial";
  if (/main.?menu|back|home.?menu|menu/.test(t))                            return "greeting";
  return "fallback";
}

// Render simple **bold** markdown
function RenderText({ text }) {
  return (
    <div style={{ lineHeight: 1.6, fontSize: 13 }}>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          <p key={i} style={{ margin: "2px 0" }}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      })}
    </div>
  );
}

export default function AssistantWidget() {
  // ── Persisted state ────────────────────────────────────
  const [pos, setPos]     = useState(() => {
    try { const s = JSON.parse(localStorage.getItem("asst_pos")); return s || { x: window.innerWidth - 80, y: window.innerHeight - 80 }; } catch { return { x: window.innerWidth - 80, y: window.innerHeight - 80 }; }
  });
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem("asst_hidden") === "1"; } catch { return false; }
  });
  const [open, setOpen]   = useState(false);
  const [messages, setMessages] = useState(null); // null = not yet greeted
  const [input, setInput] = useState("");

  const dragRef   = useRef(null);
  const dragging  = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const didDrag   = useRef(false);
  const chatBottom = useRef(null);
  const inputRef  = useRef(null);
  const longPress = useRef(null);

  // Persist position
  useEffect(() => {
    try { localStorage.setItem("asst_pos", JSON.stringify(pos)); } catch {}
  }, [pos]);

  // Persist hidden
  useEffect(() => {
    try { localStorage.setItem("asst_hidden", hidden ? "1" : "0"); } catch {}
  }, [hidden]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Escape closes chat
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Dragging logic ──────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    if (e.button === 2) return; // right-click handled by onContextMenu
    dragging.current = true;
    didDrag.current  = false;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    dragRef.current?.setPointerCapture(e.pointerId);

    // Long press = hide (500ms)
    longPress.current = setTimeout(() => {
      setHidden(true);
      dragging.current = false;
    }, 600);
  }, [pos]);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      didDrag.current = true;
      clearTimeout(longPress.current);
    }
    const newX = Math.max(0, Math.min(window.innerWidth  - 56, dragStart.current.px + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 56, dragStart.current.py + dy));
    setPos({ x: newX, y: newY });
  }, []);

  const onPointerUp = useCallback((e) => {
    clearTimeout(longPress.current);
    if (!dragging.current) return;
    dragging.current = false;
    if (!didDrag.current) {
      // It was a tap — toggle chat
      if (!open) {
        if (!messages) {
          setMessages([{ role: "assistant", ...GREETING }]);
        }
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [open, messages]);

  // Right-click = hide
  const onContextMenu = useCallback((e) => {
    e.preventDefault();
    setHidden(true);
    setOpen(false);
  }, []);

  // ── Send message ────────────────────────────────────────
  const sendMessage = useCallback((text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput("");

    const userMsg = { role: "user", text: trimmed };
    const key = matchResponse(trimmed);
    const resp = key === "greeting"
      ? { role: "assistant", ...GREETING }
      : { role: "assistant", ...RESPONSES[key] };

    setMessages(prev => [...(prev || []), userMsg, resp]);
  }, [input]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Determine chat panel position ───────────────────────
  const panelRight   = pos.x + 56 > window.innerWidth  / 2;
  const panelBottom  = pos.y + 56 > window.innerHeight / 2;

  // ── Hidden restore tab ──────────────────────────────────
  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        style={{
          position: "fixed", right: 0, bottom: 120, zIndex: 9999,
          background: "linear-gradient(135deg,#0f6b5b,#1a9478)",
          color: "white", border: "none", cursor: "pointer",
          borderRadius: "8px 0 0 8px", padding: "10px 8px",
          fontSize: 11, fontWeight: 700, writingMode: "vertical-rl",
          letterSpacing: 1, boxShadow: "-3px 0 12px rgba(0,0,0,0.18)",
          transition: "all 0.2s ease",
        }}
        title="Show assistant"
        aria-label="Show learning assistant"
      >
        💬 Assistant
      </button>
    );
  }

  return (
    <>
      {/* ── Floating circle button ── */}
      <div
        ref={dragRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onContextMenu={onContextMenu}
        style={{
          position: "fixed",
          left: pos.x, top: pos.y,
          width: 52, height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#0f6b5b,#1a9478)",
          boxShadow: open
            ? "0 0 0 3px rgba(15,107,91,0.4), 0 8px 24px rgba(0,0,0,0.25)"
            : "0 4px 16px rgba(0,0,0,0.22)",
          cursor: dragging.current ? "grabbing" : "grab",
          zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          userSelect: "none", touchAction: "none",
          transition: "box-shadow 0.2s ease",
        }}
        title="Ask me anything (right-click to hide)"
        aria-label="Open learning assistant"
      >
        <span style={{ fontSize: 22, pointerEvents: "none" }}>💬</span>

        {/* Unread dot — only shown before first open */}
        {!messages && (
          <span style={{
            position: "absolute", top: 2, right: 2,
            width: 12, height: 12, borderRadius: "50%",
            background: "#e53935", border: "2px solid white",
          }} />
        )}
      </div>

      {/* ── Chat panel ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            left:   panelRight   ? undefined : pos.x,
            right:  panelRight   ? window.innerWidth  - pos.x - 56 + 8 : undefined,
            bottom: panelBottom  ? window.innerHeight - pos.y + 8 : undefined,
            top:    panelBottom  ? undefined : pos.y + 64,
            width: "min(320px, calc(100vw - 24px))",
            maxHeight: "70vh",
            background: "white",
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
            display: "flex", flexDirection: "column",
            zIndex: 9998,
            overflow: "hidden",
            fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
          }}
          role="dialog"
          aria-label="Learning assistant chat"
        >
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg,#0f6b5b,#1a9478)",
            padding: "12px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>💬</span>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
                  Learning Assistant
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                  South Sudan E-Learning
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setHidden(true)}
                style={{
                  background: "rgba(255,255,255,0.18)", border: "none",
                  color: "white", borderRadius: 6, width: 26, height: 26,
                  cursor: "pointer", fontSize: 13, display: "grid", placeItems: "center",
                }}
                title="Hide assistant"
                aria-label="Hide assistant"
              >
                👁
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.18)", border: "none",
                  color: "white", borderRadius: 6, width: 26, height: 26,
                  cursor: "pointer", fontSize: 16, display: "grid", placeItems: "center",
                }}
                title="Close chat"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1, overflowY: "auto", padding: "12px 12px 4px",
              display: "flex", flexDirection: "column", gap: 10,
            }}
            aria-live="polite"
          >
            {(messages || []).map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
              }}>
                <div style={{
                  padding: "9px 12px",
                  background: msg.role === "user" ? "#0f6b5b" : "#f5f7f9",
                  color: msg.role === "user" ? "white" : "#122033",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  fontSize: 13, lineHeight: 1.5,
                }}>
                  {msg.role === "assistant"
                    ? <RenderText text={msg.text} />
                    : <span>{msg.text}</span>
                  }
                </div>

                {/* Quick reply chips */}
                {msg.role === "assistant" && msg.chips && i === (messages.length - 1) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {msg.chips.map((chip, ci) => (
                      <button
                        key={ci}
                        onClick={() => sendMessage(chip)}
                        style={{
                          padding: "5px 10px", borderRadius: 20,
                          border: "1px solid #c8e6c9", background: "white",
                          color: "#0f6b5b", fontSize: 11, cursor: "pointer",
                          fontWeight: 600, transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.target.style.background="#0f6b5b"; e.target.style.color="white"; }}
                        onMouseLeave={e => { e.target.style.background="white"; e.target.style.color="#0f6b5b"; }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottom} />
          </div>

          {/* Input */}
          <div style={{
            padding: "8px 10px",
            borderTop: "1px solid #f0f0f0",
            display: "flex", gap: 6, flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your question…"
              style={{
                flex: 1, border: "1.5px solid #e0e0e0", borderRadius: 20,
                padding: "8px 12px", fontSize: 12, outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "#0f6b5b"}
              onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
              aria-label="Type your question"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              style={{
                width: 34, height: 34, borderRadius: "50%", border: "none",
                background: input.trim() ? "#0f6b5b" : "#e0e0e0",
                color: "white", cursor: input.trim() ? "pointer" : "default",
                fontSize: 15, display: "grid", placeItems: "center",
                flexShrink: 0, transition: "background 0.15s",
              }}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
