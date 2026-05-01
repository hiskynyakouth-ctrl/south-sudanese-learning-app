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
            <span></span>
            <div>
              <strong>Login required to access subjects</strong>
              <p>Create a free account or login to start learning.</p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Link to="/login" className="primary-link">Login</Link>
              <Link to="/register" className="home-register-link">Register</Link>
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
              <span className="home-class-arrow">{isAuthenticated ? "→" : ""}</span>
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

      {/* ── CONTACT / FOLLOW ── */}
      <section className="home-follow-section">
        <small className="home-follow-label">Follow Me Here</small>
        <div className="home-follow-row">

          {/* Facebook */}
          <a href="https://www.facebook.com/HiskyBaby" target="_blank" rel="noreferrer"
            className="home-follow-dot facebook" title="Facebook — @HiskyBaby">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/message/YZO6RMBL5DPCO1" target="_blank" rel="noreferrer"
            className="home-follow-dot whatsapp" title="WhatsApp">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/hiskybaby22" target="_blank" rel="noreferrer"
            className="home-follow-dot instagram" title="Instagram — @hiskybaby22">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/in/thiyang-koang-358091400" target="_blank" rel="noreferrer"
            className="home-follow-dot linkedin" title="LinkedIn — Thiyang Koang">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* TikTok */}
          <a href="https://www.tiktok.com/@hiskyb77" target="_blank" rel="noreferrer"
            className="home-follow-dot tiktok" title="TikTok — @hiskyb77">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
            </svg>
          </a>

        </div>
      </section>

    </div>
  );
}
