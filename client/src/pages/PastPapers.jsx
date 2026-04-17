import { useState } from "react";

const subjectIcon = {
  Physics: "⚡", Biology: "🧬", Mathematics: "📐", English: "📖",
  Chemistry: "⚗️", History: "🏛️", Geography: "🌍", Economics: "💰",
  CRE: "✝️", Citizenship: "🇸🇸", "Computer Studies": "💻",
  Agriculture: "🌱", Accounting: "📊", "English Literature": "📜",
  "Fine Art": "🎨", "Additional Mathematics": "🔢",
};

const SUBJECTS = [
  "Physics", "Biology", "Mathematics", "English", "Chemistry",
  "History", "Geography", "Economics", "CRE", "Citizenship",
  "Computer Studies", "Agriculture", "Accounting", "English Literature",
  "Fine Art", "Additional Mathematics",
];

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

function searchUrl(subject, year) {
  return `https://www.scribd.com/search?query=South+Sudan+${encodeURIComponent(subject)}+past+paper+${year}`;
}

// Build the pastPapers array — confirmed real links for Physics 2021 & Biology 2021,
// Scribd search URLs for everything else.
const pastPapers = (() => {
  const entries = [];
  let id = 1;

  const confirmed = {
    "Physics-2021-Paper 1": "https://www.scribd.com/document/873915210/Physics-2021-Set-B-1-2",
    "Biology-2021-Paper 1": "https://www.scribd.com/document/783949328/BIO-1",
  };

  for (const subject of SUBJECTS) {
    for (const year of YEARS) {
      const papers = ["Paper 1", "Paper 2"];
      for (const paper of papers) {
        const key = `${subject}-${year}-${paper}`;
        const url = confirmed[key] ?? searchUrl(subject, year);
        entries.push({
          id: id++,
          subject,
          year,
          title: `${subject} ${year} — ${paper}`,
          paper,
          url,
        });
      }
    }
  }

  return entries;
})();

export default function PastPapers() {
  const [activeSubject, setActiveSubject] = useState("All");
  const [activeYear, setActiveYear] = useState("All");

  const filtered = pastPapers.filter((p) => {
    const matchSubject = activeSubject === "All" || p.subject === activeSubject;
    const matchYear = activeYear === "All" || p.year === Number(activeYear);
    return matchSubject && matchYear;
  });

  return (
    <div className="pp-shell">
      <div className="pp-header">
        <span className="eyebrow">South Sudan National Examinations — SSSCE / SSCE</span>
        <h1>Past Examination Papers</h1>
        <p>Browse and download past papers from 2020 to 2024. Filter by subject or year to find what you need.</p>
        <div className="pp-notice">
          📅 <strong>2025 &amp; 2026 papers will be added when released</strong> by the National Examinations Council.
        </div>
      </div>

      <div className="pp-filters">
        <div className="pp-filter-group">
          <span className="filter-label">Subject</span>
          <div className="filter-row">
            {["All", ...SUBJECTS].map((s) => (
              <button
                key={s}
                className={`filter-pill${activeSubject === s ? " active" : ""}`}
                onClick={() => setActiveSubject(s)}
              >
                {s !== "All" && subjectIcon[s] ? `${subjectIcon[s]} ` : ""}{s}
              </button>
            ))}
          </div>
        </div>

        <div className="pp-filter-group">
          <span className="filter-label">Year</span>
          <div className="filter-row">
            {["All", ...YEARS].map((y) => (
              <button
                key={y}
                className={`filter-pill${activeYear === String(y) || (y === "All" && activeYear === "All") ? " active" : ""}`}
                onClick={() => setActiveYear(String(y))}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pp-results">
        <div className="pp-results-header">
          {filtered.length} paper{filtered.length !== 1 ? "s" : ""} found
          {activeSubject !== "All" && ` · ${activeSubject}`}
          {activeYear !== "All" && ` · ${activeYear}`}
        </div>

        {filtered.length === 0 ? (
          <div className="pp-empty">
            <span style={{ fontSize: "3rem" }}>📭</span>
            <p>No papers found for the selected filters.</p>
            <button className="ghost-button" onClick={() => { setActiveSubject("All"); setActiveYear("All"); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="pp-grid">
            {filtered.map((p) => (
              <div key={p.id} className="pp-card">
                <div className="pp-card-icon">{subjectIcon[p.subject] ?? "📄"}</div>
                <div className="pp-card-body">
                  <div className="pp-card-subject">{p.subject}</div>
                  <div className="pp-card-title">{p.title}</div>
                  <div className="pp-card-year">
                    <span>{p.year}</span>
                    <span className="pp-card-paper-badge">{p.paper}</span>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="pp-card-btn"
                  >
                    📥 Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
