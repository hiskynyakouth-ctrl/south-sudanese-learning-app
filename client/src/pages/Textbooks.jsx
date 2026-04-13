import { useState } from "react";
import textbooks from "../data/textbooks";

const subjects = ["All", ...new Set(textbooks.map((b) => b.subject))];

const subjectIcon = {
  Mathematics: "📐",
  English: "📖",
  Biology: "🧬",
  Chemistry: "⚗️",
  Physics: "⚡",
  History: "🏛️",
  Geography: "🌍",
  Economics: "📊",
  CRE: "✝️",
  Citizenship: "🏳️",
  Agriculture: "🌱",
  General: "📚",
};

export default function Textbooks() {
  const [activeSubject, setActiveSubject] = useState("All");

  const filtered =
    activeSubject === "All"
      ? textbooks
      : textbooks.filter((b) => b.subject === activeSubject);

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <span className="eyebrow">Reading materials</span>
        <h1>Textbooks &amp; PDFs</h1>
        <p>
          Official South Sudan Ministry of Education textbooks. Click "Open" to
          read or download each book on Scribd.
        </p>
      </section>

      {/* Subject filter pills */}
      <div className="filter-row">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`filter-pill${activeSubject === s ? " active" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="responsive-grid">
        {filtered.map((book) => (
          <div key={book.id} className="card textbook-card">
            <div className="textbook-cover-placeholder">
              <span>{subjectIcon[book.subject] ?? "📚"}</span>
            </div>
            <div className="card-copy">
              <span className="eyebrow">{book.subject} · {book.grade}</span>
              <h3 style={{ margin: "4px 0 6px" }}>{book.title}</h3>
              <p style={{ fontSize: "0.9rem" }}>{book.description}</p>
            </div>
            <a
              href={book.url}
              target="_blank"
              rel="noreferrer"
              className="primary-button"
              style={{ textAlign: "center", padding: "12px 18px" }}
            >
              Open on Scribd →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
