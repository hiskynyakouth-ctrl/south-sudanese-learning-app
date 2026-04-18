import { useState } from "react";

const subjectIcon = {
  Physics:"⚡",Biology:"🧬",Mathematics:"📐",English:"📖",Chemistry:"⚗️",
  History:"🏛️",Geography:"🌍",Economics:"💰",CRE:"✝️",Citizenship:"🇸🇸",
  "Computer Studies":"💻",Agriculture:"🌱",Accounting:"📊",
  "English Literature":"📜","Fine Art":"🎨","Additional Mathematics":"🔢",
};

const subjectColor = {
  Physics:"#6a1b9a",Biology:"#2e7d32",Mathematics:"#c62828",English:"#1565c0",
  Chemistry:"#e65100",History:"#bf360c",Geography:"#006064",Economics:"#1b5e20",
  CRE:"#4a148c",Citizenship:"#f57f17","Computer Studies":"#283593",
  Agriculture:"#33691e",Accounting:"#004d40","English Literature":"#558b2f",
  "Fine Art":"#880e4f","Additional Mathematics":"#880e4f",
};

const SUBJECTS = [
  "Physics","Biology","Mathematics","English","Chemistry",
  "History","Geography","Economics","CRE","Citizenship",
  "Computer Studies","Agriculture","Accounting","English Literature",
  "Fine Art","Additional Mathematics",
];

const YEARS = [2026,2025,2024,2023,2022,2021,2020];

const confirmed = {
  "Physics-2021-Paper 1":"https://www.scribd.com/document/873915210/Physics-2021-Set-B-1-2",
  "Biology-2021-Paper 1":"https://www.scribd.com/document/783949328/BIO-1",
};

const searchUrl = (subject, year) =>
  `https://www.scribd.com/search?query=South+Sudan+${encodeURIComponent(subject)}+past+paper+${year}`;

const pastPapers = (() => {
  const entries = [];
  let id = 1;
  for (const subject of SUBJECTS) {
    for (const year of YEARS) {
      for (const paper of ["Paper 1","Paper 2"]) {
        const key = `${subject}-${year}-${paper}`;
        entries.push({ id:id++, subject, year, paper, url: confirmed[key] ?? searchUrl(subject,year) });
      }
    }
  }
  return entries;
})();

// ── By Year view ─────────────────────────────────────────
function YearView({ activeSubject }) {
  const years = YEARS;
  return (
    <div className="pp-year-view">
      {years.map((year) => {
        const papers = pastPapers.filter(
          (p) => p.year === year && (activeSubject === "All" || p.subject === activeSubject)
        );
        const isUpcoming = year >= 2025;
        return (
          <div key={year} className={`pp-year-block${isUpcoming ? " upcoming" : ""}`}>
            <div className="pp-year-header">
              <div className="pp-year-badge" style={{ background: isUpcoming ? "#9e9e9e" : "#1a73e8" }}>
                {year}
              </div>
              <div>
                <strong>{isUpcoming ? `${year} — Coming Soon` : `${year} Examinations`}</strong>
                <span>{isUpcoming ? "Papers will be added when released" : `${papers.length} papers available`}</span>
              </div>
              {isUpcoming && <span className="pp-upcoming-badge">🔜 Upcoming</span>}
            </div>
            {!isUpcoming && (
              <div className="pp-year-grid">
                {papers.map((p) => (
                  <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="pp-mini-card"
                    style={{ borderColor: subjectColor[p.subject] || "#1a73e8" }}>
                    <div className="pp-mini-icon" style={{ background: (subjectColor[p.subject] || "#1a73e8") + "22" }}>
                      {subjectIcon[p.subject] ?? "📄"}
                    </div>
                    <div className="pp-mini-body">
                      <span className="pp-mini-subject" style={{ color: subjectColor[p.subject] || "#1a73e8" }}>
                        {p.subject}
                      </span>
                      <span className="pp-mini-paper">{p.paper}</span>
                    </div>
                    <span className="pp-mini-dl">📥</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── By Subject view ───────────────────────────────────────
function SubjectView({ activeYear }) {
  return (
    <div className="pp-subject-view">
      {SUBJECTS.map((subject) => {
        const color = subjectColor[subject] || "#1a73e8";
        const papers = pastPapers.filter(
          (p) => p.subject === subject && (activeYear === "All" || p.year === Number(activeYear))
        );
        const byYear = YEARS.reduce((acc, y) => {
          acc[y] = papers.filter((p) => p.year === y);
          return acc;
        }, {});
        return (
          <div key={subject} className="pp-subject-block">
            <div className="pp-subject-header" style={{ borderLeftColor: color }}>
              <span className="pp-subject-icon" style={{ background: color + "22" }}>
                {subjectIcon[subject] ?? "📄"}
              </span>
              <div>
                <strong style={{ color }}>{subject}</strong>
                <span>{papers.length} papers · {YEARS.filter(y => y < 2025).length} years</span>
              </div>
            </div>
            <div className="pp-subject-years">
              {YEARS.map((year) => {
                const yPapers = byYear[year] || [];
                const isUpcoming = year >= 2025;
                return (
                  <div key={year} className={`pp-year-col${isUpcoming ? " upcoming" : ""}`}>
                    <div className="pp-year-col-label" style={{ background: isUpcoming ? "#eeeeee" : color }}>
                      {year}
                    </div>
                    {isUpcoming ? (
                      <div className="pp-year-col-soon">🔜</div>
                    ) : (
                      yPapers.map((p) => (
                        <a key={p.id} href={p.url} target="_blank" rel="noreferrer"
                          className="pp-year-col-btn" style={{ background: color }}>
                          {p.paper.replace("Paper ","")}
                        </a>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PastPapers() {
  const [tab, setTab] = useState("year");
  const [activeSubject, setActiveSubject] = useState("All");
  const [activeYear, setActiveYear] = useState("All");

  const TABS = [
    { key:"year",    label:"📅 Browse by Year" },
    { key:"subject", label:"📚 Browse by Subject" },
  ];

  return (
    <div className="pp-shell">
      <div className="pp-header">
        <span className="eyebrow">South Sudan National Examinations — SSSCE / SSCE</span>
        <h1>Past Examination Papers</h1>
        <p>Browse and download past papers from 2020 to 2024. Filter by year or subject.</p>
        <div className="pp-notice">
          📅 <strong>2025 &amp; 2026 papers will be added when released</strong> by the National Examinations Council.
        </div>
      </div>

      {/* Category tabs */}
      <div className="cat-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`cat-tab${tab===t.key?" active":""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {tab === "year" && (
        <div className="cat-filter-row">
          <span className="filter-label">Subject:</span>
          <div className="filter-row">
            <button className={`filter-pill${activeSubject==="All"?" active":""}`} onClick={() => setActiveSubject("All")}>All</button>
            {SUBJECTS.map((s) => (
              <button key={s} className={`filter-pill${activeSubject===s?" active":""}`} onClick={() => setActiveSubject(s)}>
                {subjectIcon[s]} {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "subject" && (
        <div className="cat-filter-row">
          <span className="filter-label">Year:</span>
          <div className="filter-row">
            <button className={`filter-pill${activeYear==="All"?" active":""}`} onClick={() => setActiveYear("All")}>All Years</button>
            {YEARS.map((y) => (
              <button key={y} className={`filter-pill${activeYear===String(y)?" active":""}`} onClick={() => setActiveYear(String(y))}>
                {y}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Views */}
      {tab === "year"    && <YearView    activeSubject={activeSubject} />}
      {tab === "subject" && <SubjectView activeYear={activeYear} />}
    </div>
  );
}
