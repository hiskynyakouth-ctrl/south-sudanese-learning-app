import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import scienceImg from "../assets/science.jfif";
import classroomImg from "../assets/classroom.jfif";
import YouTubeIcon from "../components/YouTubeIcon";

const classes = [
  { id: 1, emoji: "1️⃣", color: "#0f6b5b", desc: "15 core subjects — foundations in all areas" },
  { id: 2, emoji: "2️⃣", color: "#1b3558", desc: "15 core subjects — deeper problem solving" },
  { id: 3, emoji: "3️⃣", color: "#7b3f00", desc: "Stream split — Natural & Social Sciences" },
  { id: 4, emoji: "4️⃣", color: "#5a1a6e", desc: "Stream split — exam prep & AI study help" },
];

const features = [
  { icon: "📖", label: "Full Notes", to: "/#classes" },
  { icon: "🎥", label: "YouTube Tutorials", to: "/#classes", isYT: true },
  { icon: "❓", label: "Q&A Discussion", to: "/#classes" },
  { icon: "📝", label: "Quizzes & Exams", to: "/#classes" },
  { icon: "�", label: "Student Progress", to: "/#classes" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="home-shell">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-text">
          <span className="eyebrow">South Sudan Secondary School E-Learning Platform</span>
          <h1>Learn Smarter.<br />Study Anywhere.</h1>
          <p className="home-abstract">
            Aligned with South Sudan curriculum and East African standards. Supporting Senior 1–4
            with structured subjects, topics, notes, videos, quizzes and past
            examination papers.
          </p>
          <div className="home-owner-tag">
            <span className="home-owner-label">Contact Developer</span>
            <span className="home-owner-name">Thiyang Koang</span>
          </div>
          <div className="home-hero-actions">
            <Link to="/streams/1" className="home-cta-btn">Start Learning →</Link>
          </div>
        </div>
        <div className="home-hero-badge">
          <div className="hero-badge-circle">
            <img
              src="https://flagcdn.com/w160/ss.png"
              alt="South Sudan Flag"
              style={{ width: 110, height: 75, objectFit: "cover", borderRadius: 12 }}
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home-features-row">
        {features.map((f) => (
          <button key={f.label} className="home-feature-chip"
            onClick={() => document.getElementById("classes")?.scrollIntoView({ behavior: "smooth" })}>
            <span>{f.isYT ? <YouTubeIcon size={18} /> : f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </section>

      {/* ── CLASS SELECTOR ── */}
      <section id="classes">
        <div className="home-section-head">
          <h2>Choose your class to start learning 👇</h2>
          <p>Each class has full subject modules, notes, videos, quizzes.</p>
        </div>
        {!isAuthenticated && (
          <div className="home-login-prompt">
            <span>🔒</span>
            <div>
              <strong>Login required to access subjects</strong>
              <p>Create a free account or login to start learning.</p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Link to="/login" className="primary-link">Login</Link>
              <Link to="/register" className="ghost-link">Register</Link>
            </div>
          </div>
        )}
        <div className="home-class-grid">
          {classes.map((c) => (
            <Link key={c.id} to={isAuthenticated ? `/streams/${c.id}` : "/login"}
              className="home-class-card" style={{ "--card-color": c.color }}>
              <div className="home-class-num">{c.id}</div>
              <div className="home-class-info">
                <strong>Senior {c.id}</strong>
                <span>{c.desc}</span>
              </div>
              <span className="home-class-arrow">{isAuthenticated ? "→" : "🔒"}</span>
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
          <div className="home-stream-card natural-stream-card" style={{ backgroundImage: `url(${scienceImg})` }}>
            <div className="home-stream-icon">🔬</div>
            <h3>Natural Sciences</h3>
            <p>English · Mathematics · Physics · Chemistry · Biology · Agriculture · CRE · Additional Mathematics</p>
            <span className="home-stream-count">8 subjects</span>
          </div>
          <div className="home-stream-card social-stream-card" style={{ backgroundImage: `url(${classroomImg})` }}>
            <div className="home-stream-icon">📚</div>
            <h3>Social Sciences</h3>
            <p>English · History · Geography · Economics · Mathematics · Fine Art · Accounting · English Literature · CRE</p>
            <span className="home-stream-count">9 subjects</span>
          </div>
        </div>
      </section>

      {/* ── PAST PAPERS ── */}
      <section className="home-pp-section">
        <div className="home-section-head">
          <h2>📄 Past Examination Papers</h2>
          <p>Practice with real national exam papers — filter by subject and year.</p>
        </div>
        <div className="home-pp-grid">
          {["Physics","Biology","Mathematics","English","Chemistry","History","Geography","Economics"].map((sub) => (
            <Link key={sub} to="/past-papers" className="home-pp-card">
              <span>📄</span>
              <strong>{sub}</strong>
              <span className="home-pp-label">Past Papers</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:16 }}>
          <Link to="/past-papers" className="home-cta-btn" style={{ display:"inline-block" }}>
            View All Past Papers →
          </Link>
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
