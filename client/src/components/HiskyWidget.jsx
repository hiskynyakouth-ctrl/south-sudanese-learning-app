import { useState, useEffect } from "react";

export default function HiskyWidget() {
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem("hisky_widget_hidden") === "1"; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem("hisky_widget_hidden", hidden ? "1" : "0"); } catch {}
  }, [hidden]);

  if (hidden) return null;

  return (
    <div style={{ position: "fixed", right: 18, bottom: 18, width: 320, zIndex: 1200 }}>
      <div style={{ background: "white", borderRadius: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", overflow: "hidden", fontFamily: 'Inter, system-ui, Arial' }}>
        <div style={{ display: "flex", gap: 12, padding: 12, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#0f6b5b,#1a9478)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>H</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>Hisky — Your AI Assistant</div>
            <div style={{ fontSize: 13, color: "#555" }}>Ask me about registration, courses, payments, exams and more.</div>
          </div>
        </div>
        <div style={{ padding: 10, borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
          <button onClick={() => alert('Hi! I can help with: registration, payments, profile, exams and platform guidance.')} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', background: '#0f6b5b', color: 'white', cursor: 'pointer' }}>Ask Hisky</button>
          <button onClick={() => setHidden(true)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
