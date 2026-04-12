import { Link } from "react-router-dom";

const classes = [
  { id: 1, name: "Senior 1", focus: "Foundations in English, Mathematics, and Science." },
  { id: 2, name: "Senior 2", focus: "Build stronger problem solving with guided chapter learning." },
  { id: 3, name: "Senior 3", focus: "Prepare for stream choice with deeper subject revision." },
  { id: 4, name: "Senior 4", focus: "Revision support, exam practice, and AI study help." },
];

const streams = [
  { title: "Natural Sciences", subjects: "Mathematics, Physics, Chemistry, Biology" },
  { title: "Social Sciences", subjects: "History, Geography, Economics, Mathematics" },
];

export default function Home() {
  return (
    <div className="stack-xl">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Digital learning for South Sudan secondary schools</span>
          <h1>Notes, videos, quizzes, and AI study help in one place.</h1>
          <p>
            This platform supports Senior 1 to Senior 4 learners with subject pages, chapter-by-chapter revision,
            discussion questions, and mobile-friendly study tools.
          </p>
          <div className="hero-actions">
            <Link to="/subjects/1" className="primary-link">
              Start learning
            </Link>
            <Link to="/chat" className="ghost-link">
              Open AI tutor
            </Link>
          </div>
        </div>
        <div className="hero-stat-grid">
          <article className="stat-card">
            <strong>4</strong>
            <span>Senior levels</span>
          </article>
          <article className="stat-card">
            <strong>2</strong>
            <span>Main streams</span>
          </article>
          <article className="stat-card">
            <strong>24/7</strong>
            <span>Study access</span>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Select a class</h2>
          <p>Each class opens subjects, chapters, revision notes, and quizzes.</p>
        </div>
        <div className="responsive-grid">
          {classes.map((item) => (
            <Link key={item.id} to={`/subjects/${item.id}`} className="card class-card">
              <span className="eyebrow">Class level</span>
              <h3>{item.name}</h3>
              <p>{item.focus}</p>
              <span className="card-link-text">View subjects</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="stream-panel">
        <div className="section-heading">
          <h2>Stream split</h2>
          <p>The app can grow into the full South Sudan secondary curriculum with separate subject paths.</p>
        </div>
        <div className="responsive-grid">
          {streams.map((stream) => (
            <article key={stream.title} className="card stream-card">
              <span className="eyebrow">Academic stream</span>
              <h3>{stream.title}</h3>
              <p>{stream.subjects}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mobile-note">
        <h2>Mobile application plan</h2>
        <p>
          The current app is fully responsive for phones and tablets. For the project presentation, you can explain
          that it is ready to be extended into a React Native mobile app using the same API and database.
        </p>
      </section>
    </div>
  );
}
