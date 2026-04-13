import { Link, useParams } from "react-router-dom";
import { subjectModules, subjectIcons } from "../data/curriculum";

const youtubeSearch = (subject, module) =>
  `https://www.youtube.com/results?search_query=South+Sudan+${encodeURIComponent(subject)}+${encodeURIComponent(module)}`;

export default function SubjectModules() {
  const { subject, classId } = useParams();
  const decoded = decodeURIComponent(subject);
  const modules = subjectModules[decoded] || [];
  const icon = subjectIcons[decoded] ?? "📚";

  return (
    <div className="submod-shell">

      {/* Header */}
      <div className="submod-header">
        <Link to={`/streams/${classId}`} className="streams-back">← Back</Link>
        <div className="submod-title-row">
          <span className="submod-icon">{icon}</span>
          <div>
            <span className="eyebrow">Senior {classId} · Subject Modules</span>
            <h1>{decoded}</h1>
          </div>
        </div>
      </div>

      {/* Feature chips */}
      <div className="submod-chips">
        {["📖 Notes", "🎥 Video", "❓ Q&A", "🤖 AI Help", "📝 Quiz"].map((c) => (
          <span key={c} className="submod-chip">{c}</span>
        ))}
      </div>

      {/* Module cards */}
      <div className="submod-grid">
        {modules.map((mod, idx) => (
          <div key={mod.id} className="submod-card">
            <div className="submod-card-top">
              <div className="submod-card-num">{idx + 1}</div>
              <div className="submod-card-info">
                <strong>{mod.title}</strong>
                <span>{decoded}</span>
              </div>
            </div>

            <div className="submod-card-actions">
              <Link to={`/module/${encodeURIComponent(decoded)}/${classId}/${mod.id}`} className="submod-action-btn notes">
                📖 Read Notes
              </Link>
              <a
                href={youtubeSearch(decoded, mod.title)}
                target="_blank"
                rel="noreferrer"
                className="submod-action-btn video"
              >
                🎥 Watch Video
              </a>
              <Link to={`/module/${encodeURIComponent(decoded)}/${classId}/${mod.id}#quiz`} className="submod-action-btn quiz">
                📝 Take Quiz
              </Link>
              <Link to="/chat" className="submod-action-btn ai">
                🤖 Ask AI
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Textbook link */}
      <Link to="/textbooks" className="submod-textbook-link">
        📚 View Official Textbooks for {decoded} →
      </Link>
    </div>
  );
}
