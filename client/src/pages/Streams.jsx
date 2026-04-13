import { Link, useParams } from "react-router-dom";
import { coreSubjects, streams, subjectIcons } from "../data/curriculum";

const classNames = { 1: "Senior 1", 2: "Senior 2", 3: "Senior 3", 4: "Senior 4" };

export default function Streams() {
  const { id } = useParams();
  const classId = parseInt(id, 10);
  const className = classNames[classId] || `Senior ${classId}`;
  const isSplit = classId === 3 || classId === 4;

  return (
    <div className="streams-shell">

      {/* Header */}
      <div className="streams-header">
        <Link to="/" className="streams-back">← Home</Link>
        <h1>{className}</h1>
        <p>
          {isSplit
            ? "Choose your stream to view subjects and modules."
            : "All 15 core subjects — click any subject to open its modules."}
        </p>
      </div>

      {isSplit ? (
        /* ── SENIOR 3 & 4: Stream split ── */
        <div className="streams-split">
          {Object.entries(streams).map(([key, stream]) => (
            <div key={key} className="stream-section">
              <div className="stream-section-header" style={{ background: stream.color }}>
                <span>{key === "natural" ? "🔬" : "📚"}</span>
                <div>
                  <h2>{stream.name}</h2>
                  <small>{stream.subjects.length} subjects</small>
                </div>
              </div>
              <div className="subject-module-grid">
                {stream.subjects.map((subject, idx) => (
                  <Link
                    key={subject}
                    to={`/subject/${encodeURIComponent(subject)}/${classId}`}
                    className="subject-module-card"
                  >
                    <div className="smc-num" style={{ background: stream.color }}>{idx + 1}</div>
                    <div className="smc-icon">{subjectIcons[subject] ?? "📚"}</div>
                    <div className="smc-label">{subject}</div>
                    <div className="smc-btn" style={{ background: stream.color }}>
                      <span>📄</span> Open Modules
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── SENIOR 1 & 2: All 15 core subjects ── */
        <div className="stream-section">
          <div className="stream-section-header" style={{ background: "#0f6b5b" }}>
            <span>📘</span>
            <div>
              <h2>Core Subjects</h2>
              <small>15 subjects</small>
            </div>
          </div>
          <div className="subject-module-grid">
            {coreSubjects.map((subject, idx) => (
              <Link
                key={subject}
                to={`/subject/${encodeURIComponent(subject)}/${classId}`}
                className="subject-module-card"
              >
                <div className="smc-num">{idx + 1}</div>
                <div className="smc-icon">{subjectIcons[subject] ?? "📚"}</div>
                <div className="smc-label">{subject}</div>
                <div className="smc-btn">
                  <span>📄</span> Open Modules
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
