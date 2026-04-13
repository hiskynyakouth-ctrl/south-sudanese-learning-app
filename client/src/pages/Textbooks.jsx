import { useState } from "react";
import textbooks from "../data/textbooks";

const allSubjects = ["All", ...new Set(textbooks.map((b) => b.subject))];

const subjectIcon = {
  Mathematics: "📐", English: "📖", Biology: "🧬", Chemistry: "⚗️",
  Physics: "⚡", History: "🏛️", Geography: "🌍", Economics: "💰",
  CRE: "✝️", Citizenship: "🏳️", Agriculture: "🌱", General: "📚",
  "Computer Studies": "💻", Accounting: "📊", "English Literature": "📜",
  "Fine Art": "🎨", "Additional Mathematics": "🔢",
};

export default function Textbooks() {
  const [activeSubject, setActiveSubject] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = (activeSubject === "All" ? textbooks : textbooks.filter((b) => b.subject === activeSubject));
  const available = filtered.filter((b) => b.available);
  const coming = filtered.filter((b) => !b.available);

  return (
    <div className="tb-shell">

      {/* Header */}
      <div className="tb-header">
        <span className="eyebrow">Official Ministry of Education</span>
        <h1>South Sudan Textbooks</h1>
        <p>
          All secondary textbooks from Senior 1 to Senior 4 — written by the Government of South Sudan.
          Click any available book to read or download on Scribd.
        </p>
        <div className="tb-stats">
          <span className="tb-stat available">✅ {textbooks.filter(b => b.available).length} Available</span>
          <span className="tb-stat coming">🔜 {textbooks.filter(b => !b.available).length} Coming Soon</span>
          <span className="tb-stat total">📚 {textbooks.length} Total Books</span>
        </div>
      </div>

      {/* Subject filter */}
      <div className="filter-row">
        {allSubjects.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`filter-pill${activeSubject === s ? " active" : ""}`}
          >
            {subjectIcon[s] ?? ""} {s}
          </button>
        ))}
      </div>

      {/* Available books */}
      {available.length > 0 && (
        <div>
          <h2 className="tb-section-title">✅ Available Now</h2>
          <div className="tb-grid">
            {available.map((book) => (
              <a
                key={book.id}
                href={book.url}
                target="_blank"
                rel="noreferrer"
                className="tb-card available"
              >
                <div className="tb-card-num">{book.grade.replace("Secondary ", "S")}</div>
                <div className="tb-card-icon">{subjectIcon[book.subject] ?? "📚"}</div>
                <div className="tb-card-body">
                  <strong>{book.title}</strong>
                  <p>{book.description}</p>
                </div>
                <div className="tb-card-btn">
                  <span>📄</span> Read on Scribd
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Coming soon books */}
      {coming.length > 0 && (
        <div>
          <div className="tb-coming-header">
            <h2 className="tb-section-title">🔜 Coming Soon</h2>
            <button className="tb-toggle" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Hide" : `Show all ${coming.length}`}
            </button>
          </div>
          {showAll && (
            <div className="tb-grid">
              {coming.map((book) => (
                <div key={book.id} className="tb-card coming">
                  <div className="tb-card-num coming">{book.grade.replace("Secondary ", "S")}</div>
                  <div className="tb-card-icon">{subjectIcon[book.subject] ?? "📚"}</div>
                  <div className="tb-card-body">
                    <strong>{book.title}</strong>
                    <p>{book.description}</p>
                  </div>
                  <div className="tb-card-btn coming">
                    🔜 Not yet available
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
