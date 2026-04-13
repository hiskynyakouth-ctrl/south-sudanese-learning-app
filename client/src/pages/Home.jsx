import { Link } from "react-router-dom";

const classes = [
  { id: 1, emoji: "1️⃣", color: "#0f6b5b", desc: "15 core subjects — foundations in all areas" },
  { id: 2, emoji: "2️⃣", color: "#1b3558", desc: "15 core subjects — deeper problem solving" },
  { id: 3, emoji: "3️⃣", color: "#7b3f00", desc: "Stream split — Natural & Social Sciences" },
  { id: 4, emoji: "4️⃣", color: "#5a1a6e", desc: "Stream split — exam prep & AI study help" },
];

const features = [
  { icon: "📖", label: "Full Notes" },
  { icon: "🎥", label: "YouTube Tutorials" },
  { icon: "❓", label: "Q&A Discussion" },
  { icon: "🤖", label: "AI Chat Assistant" },
  { icon: "📝", label: "Quizzes & Exams" },
  { icon: "📊", label: "Student Progress" },
];

export default function Home() {
  return (
    <div className="home-shell">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-text">
          <span className="eyebrow">South Sudan Secondary School E-Learning Platform</span>
          <h1>Learn Smarter.<br />Study Anywhere.</h1>
          <p className="home-abstract">
            This platform supports Senior 1 to Senior 4 learners with structured notes,
            YouTube tutorials, discussion questions, quizzes, and an AI-powered study assistant.
            The curriculum follows the South Sudan Ministry of Education syllabus, divided into
            Natural Sciences and Social Sciences streams for Senior 3 and 4.
          </p>
          <div className="home-hero-actions">
            <Link to="/streams/1" className="home-cta-btn">Start Learning →</Link>
            <Link to="/chat" className="home-cta-ghost">Open AI Tutor 🤖</Link>
          </div>
        </div>
        <div className="home-hero-badge">
          <div className="hero-badge-circle">
            <span>SS</span>
            <small>E-Learning</small>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home-features-row">
        {features.map((f) => (
          <div key={f.label} className="home-feature-chip">
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </section>

      {/* ── CLASS SELECTOR ── */}
      <section>
        <div className="home-section-head">
          <h2>Choose your class to start learning 👇</h2>
          <p>Each class has full subject modules, notes, videos, quizzes, and AI help.</p>
        </div>
        <div className="home-class-grid">
          {classes.map((c) => (
            <Link key={c.id} to={`/streams/${c.id}`} className="home-class-card" style={{ "--card-color": c.color }}>
              <div className="home-class-num">{c.id}</div>
              <div className="home-class-info">
                <strong>Senior {c.id}</strong>
                <span>{c.desc}</span>
              </div>
              <span className="home-class-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── STREAMS INFO ── */}
      <section className="home-streams-section">
        <div className="home-section-head">
          <h2>Academic Streams (Senior 3 & 4)</h2>
          <p>Students choose a stream that matches their career goals.</p>
        </div>
        <div className="home-streams-grid">
          <div className="home-stream-card" style={{ background: "linear-gradient(135deg,#0f6b5b,#0a4d41)" }}>
            <div className="home-stream-icon">🔬</div>
            <h3>Natural Sciences</h3>
            <p>English · Mathematics · Physics · Chemistry · Biology · Agriculture · CRE · Additional Mathematics</p>
            <span className="home-stream-count">8 subjects</span>
          </div>
          <div className="home-stream-card" style={{ background: "linear-gradient(135deg,#1b3558,#0d2240)" }}>
            <div className="home-stream-icon">📚</div>
            <h3>Social Sciences</h3>
            <p>English · History · Geography · Economics · Mathematics · Fine Art · Accounting · English Literature · CRE</p>
            <span className="home-stream-count">9 subjects</span>
          </div>
        </div>
      </section>

      {/* ── ABSTRACT ── */}
      <section className="home-abstract-card">
        <span className="eyebrow">Project Abstract</span>
        <p>
          This project aims to develop a South Sudan Secondary School E-Learning Platform designed to support
          students from Senior 1 to Senior 4. The system provides structured learning materials including notes,
          videos, discussion questions, and AI-powered assistance to simplify learning. The platform divides
          subjects into Natural Sciences and Social Sciences streams to match the South Sudan curriculum.
          The system enhances accessibility to quality education, improves student understanding, and supports
          self-paced learning using modern technology.
        </p>
      </section>

      {/* ── MOBILE NOTE ── */}
      <section className="home-mobile-note">
        <span>📱</span>
        <div>
          <strong>Mobile Application</strong>
          <p>This platform is fully responsive and designed for phones and tablets. A React Native mobile app is planned using the same API and database.</p>
        </div>
      </section>

    </div>
  );
}
