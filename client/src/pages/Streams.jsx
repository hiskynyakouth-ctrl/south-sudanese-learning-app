import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { coreSubjects, streams, subjectIcons } from "../data/curriculum";
import scienceImg from "../assets/science.jfif";
import classroomImg from "../assets/classroom.jfif";

const classNames = { 1: "Senior 1", 2: "Senior 2", 3: "Senior 3", 4: "Senior 4" };

const renderIcon = (subject) => {
  const icon = subjectIcons[subject] ?? "📚";
  if (icon === "🇸🇸_flag") {
    return <img src="https://flagcdn.com/w80/ss.png" alt="South Sudan Flag"
      style={{ width: 48, height: 32, borderRadius: 4, objectFit: "cover" }} />;
  }
  return icon;
};

function SubjectCard({ subject, idx, classId, color }) {
  const navigate = useNavigate();
  return (
    <div className="subject-module-card"
      onClick={() => navigate(`/textbooks?subject=${encodeURIComponent(subject)}&grade=${classId}`)}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/textbooks?subject=${encodeURIComponent(subject)}&grade=${classId}`)}>
      <div className="smc-num" style={{ background: color || "#1a73e8" }}>{idx + 1}</div>
      <div className="smc-icon">{renderIcon(subject)}</div>
      <div className="smc-label">{subject}</div>
      <div className="smc-btn" style={{ background: color || "#1a73e8" }}>
        <span>📚</span> Open Textbook
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

  // For Senior 3 & 4: track which stream is selected
  const [selectedStream, setSelectedStream] = useState(null);

  return (
    <div className="streams-shell">

      <div className="streams-header">
        <button className="streams-back" onClick={() => {
          if (selectedStream) setSelectedStream(null);
          else navigate("/");
        }}>
          {selectedStream ? `← Back to ${className}` : "← Home"}
        </button>
        <h1>{className}</h1>
        <p>
          {isSplit && !selectedStream
            ? "Choose your academic stream to view subjects and modules."
            : isSplit && selectedStream
            ? `${streams[selectedStream]?.name} — click any subject to open its modules.`
            : "All 15 core subjects — click any subject to open its modules."}
        </p>
      </div>

      {/* ── SENIOR 1 & 2: Core subjects ── */}
      {!isSplit && (
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
              <SubjectCard key={subject} subject={subject} idx={idx} classId={classId} color="#1a73e8" />
            ))}
          </div>
        </div>
      )}

      {/* ── SENIOR 3 & 4: Stream picker ── */}
      {isSplit && !selectedStream && (
        <div className="stream-picker">
          <p className="stream-picker-hint">
            In Senior {classId}, students are divided into two academic streams.
            Select the stream that matches your subjects.
          </p>
          <div className="stream-picker-grid">

            {/* Natural Sciences */}
            <button className="stream-picker-card natural" onClick={() => setSelectedStream("natural")}>
              <div className="stream-picker-img">
                <img src={scienceImg} alt="Natural Sciences" />
                <div className="stream-picker-overlay" />
              </div>
              <div className="stream-picker-body">
                <span className="stream-picker-icon">🔬</span>
                <h2>Natural Sciences</h2>
                <p>Mathematics · Physics · Chemistry · Biology · Agriculture · CRE · Additional Mathematics · English</p>
                <div className="stream-picker-count">8 subjects</div>
                <div className="stream-picker-btn">Choose Natural Sciences →</div>
              </div>
            </button>

            {/* Social Sciences */}
            <button className="stream-picker-card social" onClick={() => setSelectedStream("social")}>
              <div className="stream-picker-img">
                <img src={classroomImg} alt="Social Sciences" />
                <div className="stream-picker-overlay" />
              </div>
              <div className="stream-picker-body">
                <span className="stream-picker-icon">📚</span>
                <h2>Social Sciences</h2>
                <p>History · Geography · Economics · Mathematics · Fine Art · Accounting · English Literature · CRE · English</p>
                <div className="stream-picker-count">9 subjects</div>
                <div className="stream-picker-btn">Choose Social Sciences →</div>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* ── SENIOR 3 & 4: Selected stream subjects ── */}
      {isSplit && selectedStream && (
        <div className="stream-section">
          <div className="stream-section-header" style={{ background: streams[selectedStream].color }}>
            <span>{selectedStream === "natural" ? "🔬" : "📚"}</span>
            <div>
              <h2>{streams[selectedStream].name}</h2>
              <small>{streams[selectedStream].subjects.length} subjects · {className}</small>
            </div>
            <button className="stream-change-btn" onClick={() => setSelectedStream(null)}>
              Change Stream
            </button>
          </div>
          <div className="subject-module-grid">
            {streams[selectedStream].subjects.map((subject, idx) => (
              <SubjectCard key={subject} subject={subject} idx={idx}
                classId={classId} color={streams[selectedStream].color} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
