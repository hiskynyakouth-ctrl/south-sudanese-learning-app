import { useState, useEffect } from "react";

export default function HiskyWidget() {
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem("hisky_widget_hidden") === "1"; } catch { return false; }
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("hisky_widget_hidden", hidden ? "1" : "0"); } catch {}
  }, [hidden]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (hidden) return null;

  const openIntro = () => setModalOpen(true);

  return (
    <>
      <div style={{ position: "fixed", right: 18, bottom: 18, width: 320, zIndex: 1200 }}>
        <div style={{ background: "white", borderRadius: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", overflow: "hidden", fontFamily: 'Inter, system-ui, Arial' }}>
          <div style={{ display: "flex", gap: 12, padding: 12, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#0f6b5b,#1a9478)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>H</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>Hisky — Your AI Assessor</div>
              <div style={{ fontSize: 13, color: "#555" }}>Quickly learn how the platform works before you sign up.</div>
            </div>
          </div>
          <div style={{ padding: 10, borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
            <button onClick={openIntro} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', background: '#0f6b5b', color: 'white', cursor: 'pointer' }}>Ask Hisky</button>
            <button onClick={() => setHidden(true)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Hide</button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300 }}>
          <div onClick={() => setModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{ width: 600, maxWidth: '95%', background: 'white', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 10, background: 'linear-gradient(135deg,#0f6b5b,#1a9478)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 }}>H</div>
                <div>
                  <h2 style={{ margin: 0 }}>Hello 👋 I’m Hisky — your AI Assessor</h2>
                  <p style={{ marginTop: 6, color: '#555' }}>I’ll guide you through registering, exploring courses, payments, exams and everything the platform offers — before you sign in.</p>
                </div>
              </div>

              <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #f0f0f0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0' }}>What I Can Do</h4>
                  <ul style={{ marginTop: 6, color: '#444' }}>
                    <li>Explain roles: Student, Teacher, Admin</li>
                    <li>Guide registration and login</li>
                    <li>Show how to buy courses and subscribe</li>
                    <li>Explain payment & country options</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px 0' }}>Quick Start</h4>
                  <ol style={{ marginTop: 6, color: '#444' }}>
                    <li>Click <strong>Get Started Free</strong> to create an account</li>
                    <li>Browse classes and enroll in a course</li>
                    <li>Use the Payments page to subscribe</li>
                    <li>Take quizzes and download certificates</li>
                  </ol>
                </div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <a href="/docs/Hisky.md" target="_blank" rel="noreferrer" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: 'white', color: '#333', textDecoration: 'none' }}>Read more</a>
                <button onClick={() => setModalOpen(false)} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#0f6b5b', color: 'white' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
