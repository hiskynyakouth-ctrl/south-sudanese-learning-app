import { useNavigate, useParams } from "react-router-dom";
import { subjectModules, subjectIcons } from "../data/curriculum";

const youtubeSearch = (subject, mod) =>
  `https://www.youtube.com/results?search_query=South+Sudan+${encodeURIComponent(subject)}+${encodeURIComponent(mod)}`;

export default function SubjectModules() {
  const { subject, classId } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(subject);
  const modules = subjectModules[decoded] || [];
  const icon = subjectIcons[decoded] ?? "📚";

  return (
    <div className="submod-shell">

      <div className="submod-header">
        <button className="streams-back" onClick={() => navigate(`/streams/${classId}`)}>
          ← Back to {decoded}
        </button>
        <div className="submod-title-row">
          <span className="submod-icon">{icon}</span>
          <div>
            <span className="eyebrow">Senior {classId} · Subject Modules</span>
            <h1>{decoded}</h1>
          </div>
        </div>
      </div>

      <div className="submod-chips">
        {["📖 Notes", "🎥 Video", "❓ Q&A", "🤖 AI Help", "📝 Quiz"].map((c) => (
          <span key={c} className="submod-chip">{c}</span>
        ))}
      </div>

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
              <button
                className="submod-action-btn notes"
                onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/${mod.id}`)}
              >
                📖 Read Notes
              </button>
              <a
                href={youtubeSearch(decoded, mod.title)}
                target="_blank"
                rel="noreferrer"
                className="submod-action-btn video"
              >
                🎥 Watch Video
              </a>
              <button
                className="submod-action-btn quiz"
                onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/${mod.id}?tab=quiz`)}
              >
                📝 Take Quiz
              </button>
              <button
                className="submod-action-btn ai"
                onClick={() => navigate("/chat")}
              >
                🤖 Ask AI
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="submod-textbook-link"
        onClick={() => navigate("/textbooks")}
      >
        📚 View Official Textbooks for {decoded} →
      </button>
    </div>
  );
}
