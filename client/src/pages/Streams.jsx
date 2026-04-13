import { useNavigate, useParams } from "react-router-dom";
import { coreSubjects, streams, subjectIcons } from "../data/curriculum";

const classNames = { 1: "Senior 1", 2: "Senior 2", 3: "Senior 3", 4: "Senior 4" };

function SubjectCard({ subject, idx, classId, color }) {
  const navigate = useNavigate();
  return (
    <div
      className="subject-module-card"
      onClick={() => navigate(`/subject/${encodeURIComponent(subject)}/${classId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/subject/${encodeURIComponent(subject)}/${classId}`)}
    >
      <div className="smc-num" style={{ background: color || "#1a73e8" }}>{idx + 1}</div>
      <div className="smc-icon">{subjectIcons[subject] ?? "📚"}</div>
      <div className="smc-label">{subject}</div>
      <div className="smc-btn" style={{ background: color || "#1a73e8" }}>
        <span>📄</span> Open Modules
      </div>
    </div>
  );
}

export default function Streams() {
  const { id } = useParams();
  const navigate = useNavigate();
  const classId = parseInt(id, 10);
  const className = classNames[classId] || `Senior ${classId}`;
  const isSplit = classId === 3 || classId === 4;

  return (
    <div className="streams-shell">

      <div className="streams-header">
        <button className="streams-back" onClick={() => navigate("/")}>← Home</button>
        <h1>{className}</h1>
        <p>
          {isSplit
            ? "Choose your stream to view subjects and modules."
            : "All 15 core subjects — click any subject to open its modules."}
        </p>
      </div>

      {isSplit ? (
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
                  <SubjectCard
                    key={subject}
                    subject={subject}
                    idx={idx}
                    classId={classId}
                    color={stream.color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
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
              <SubjectCard
                key={subject}
                subject={subject}
                idx={idx}
                classId={classId}
                color="#1a73e8"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
