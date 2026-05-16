import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { subjectModules, coreSubjects, streams } from "../data/curriculum";

// Build a flat searchable index from all curriculum data
const buildIndex = () => {
  const items = [];

  // All subjects
  coreSubjects.forEach(sub => {
    items.push({ type: "subject", title: sub, subtitle: "Senior 1 & 2 — Core Subject", url: `/textbooks?subject=${encodeURIComponent(sub)}&grade=1`, icon: "📚" });
  });

  // Stream subjects
  Object.values(streams).forEach(stream => {
    stream.subjects.forEach(sub => {
      items.push({ type: "subject", title: sub, subtitle: `${stream.name} — Senior 3 & 4`, url: `/textbooks?subject=${encodeURIComponent(sub)}&grade=3`, icon: "📚" });
    });
  });

  // All modules
  Object.entries(subjectModules).forEach(([subject, mods]) => {
    mods.forEach(mod => {
      items.push({
        type: "module",
        title: mod.title,
        subtitle: `${subject} — Module ${mod.id}`,
        url: `/module/${encodeURIComponent(subject)}/1/${mod.id}?tab=notes`,
        icon: "📖",
        subject,
      });
    });
  });

  // Grades
  [1,2,3,4].forEach(g => {
    items.push({ type: "grade", title: `Senior ${g}`, subtitle: `All subjects for Senior ${g}`, url: `/streams/${g}`, icon: g <= 2 ? "📘" : "🔬" });
  });

  return items;
};

const INDEX = buildIndex();

const TYPE_COLORS = {
  subject: "#0f6b5b",
  module:  "#1565c0",
  grade:   "#6a1b9a",
};

export default function Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.subject || "").toLowerCase().includes(q)
    ).slice(0, 30);
  }, [query]);

  const grouped = useMemo(() => {
    const g = {};
    results.forEach(r => {
      if (!g[r.type]) g[r.type] = [];
      g[r.type].push(r);
    });
    return g;
  }, [results]);

  const typeLabel = { subject: "Subjects", module: "Modules & Topics", grade: "Classes" };

  return (
    <div className="search-shell">
      <div className="search-header">
        <h1>🔍 Search</h1>
        <p>Search subjects, modules, topics and classes.</p>
      </div>

      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search subjects, modules, topics..."
          className="search-input"
          autoFocus
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery("")}>✕</button>
        )}
      </div>

      {query.length > 0 && query.length < 2 && (
        <p style={{ color:"var(--muted)", textAlign:"center" }}>Type at least 2 characters to search...</p>
      )}

      {query.length >= 2 && results.length === 0 && (
        <div className="search-empty">
          <span>🔍</span>
          <h3>No results for "{query}"</h3>
          <p>Try searching for a subject name like "Biology" or a topic like "Cell Biology"</p>
        </div>
      )}

      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="search-group">
          <div className="search-group-label" style={{ color: TYPE_COLORS[type] }}>
            {typeLabel[type]} ({items.length})
          </div>
          <div className="search-results-list">
            {items.map((item, i) => (
              <button key={i} className="search-result-item"
                onClick={() => navigate(item.url)}>
                <span className="search-result-icon">{item.icon}</span>
                <div className="search-result-info">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </div>
                <span className="search-result-type" style={{ background: TYPE_COLORS[type] + "22", color: TYPE_COLORS[type] }}>
                  {type}
                </span>
                <span className="search-result-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {!query && (
        <div className="search-suggestions">
          <p style={{ color:"var(--muted)", fontWeight:600, marginBottom:12 }}>Popular searches:</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {["Biology","Mathematics","Physics","Chemistry","History","Geography","Cell Biology","Algebra","Mechanics"].map(s => (
              <button key={s} className="filter-pill" onClick={() => setQuery(s)}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
