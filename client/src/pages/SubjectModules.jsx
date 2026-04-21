import { useNavigate, useParams } from "react-router-dom";
import { subjectModules, subjectIcons } from "../data/curriculum";
import textbooks from "../data/textbooks";

import YouTubeIcon from "../components/YouTubeIcon";

const ytUrl = (subject, mod) =>
  `https://www.youtube.com/results?search_query=South+Sudan+${encodeURIComponent(subject)}+${encodeURIComponent(mod)}+lesson`;

export default function SubjectModules() {
  const { subject, classId } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(subject);
  const modules = subjectModules[decoded] || [];
  const icon = subjectIcons[decoded] ?? "📚";

  return (
    <div className="submod-shell">

      {/* ── Header ── */}
      <div className="submod-header">
        <button className="streams-back" onClick={() => navigate(`/streams/${classId}`)}>
          ← Back to Senior {classId}
        </button>
        <div className="submod-title-row">
          <span className="submod-icon">{icon}</span>
          <div>
            <span className="eyebrow">Senior {classId} · Subject Modules</span>
            <h1>{decoded}</h1>
          </div>
        </div>
      </div>

      {/* ── Module cards ── */}
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
              <button className="submod-action-btn notes"
                onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/${mod.id}?tab=notes`)}>
                📖 Read Notes
              </button>
              <a href={ytUrl(decoded, mod.title)} target="_blank" rel="noreferrer"
                className="submod-action-btn video">
                <YouTubeIcon size={16} /> Watch Video
              </a>
              <button className="submod-action-btn quiz"
                onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/${mod.id}?tab=quiz`)}>
                📝 Take Quiz
              </button>
              <button className="submod-action-btn orange"
                onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/${mod.id}?tab=qa`)}>
                ❓ Q&amp;A
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom section — last page links ── */}
      <div className="submod-bottom">
        <h2 className="submod-bottom-title">📌 More Resources</h2>
        <div className="submod-bottom-grid">

          <button className="submod-bottom-card green"
            onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/1?tab=notes`)}>
            <span>📖</span>
            <strong>Full Notes</strong>
            <p>Read all chapter notes for {decoded}</p>
          </button>

          <a href={`https://www.youtube.com/results?search_query=South+Sudan+${encodeURIComponent(decoded)}+lesson`}
            target="_blank" rel="noreferrer" className="submod-bottom-card red">
            <span><YouTubeIcon size={28} /></span>
            <strong>YouTube Tutorials</strong>
            <p>Watch video lessons for {decoded}</p>
          </a>

          <button className="submod-bottom-card blue"
            onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/1?tab=quiz`)}>
            <span>📝</span>
            <strong>Quizzes &amp; Exams</strong>
            <p>Test yourself on all {decoded} modules</p>
          </button>

          <button className="submod-bottom-card orange"
            onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/1?tab=qa`)}>
            <span>❓</span>
            <strong>Q&amp;A Discussion</strong>
            <p>Discussion questions and answers</p>
          </button>

          <button className="submod-bottom-card teal"
            onClick={() => navigate("/textbooks")}>
            <span>📚</span>
            <strong>Official Textbooks</strong>
            <p>Read the official {decoded} textbook on Scribd</p>
          </button>

        </div>
      </div>

      {/* ── Subject textbooks inline ── */}
      {(() => {
        const subjectBooks = textbooks.filter(
          (b) => b.subject.toLowerCase() === decoded.toLowerCase()
        );
        if (subjectBooks.length === 0) return null;
        return (
          <div className="submod-books">
            <h2 className="submod-bottom-title">📚 Official Textbooks &amp; PDFs — {decoded}</h2>
            <div className="submod-books-grid">
              {subjectBooks.map((book) => (
                <a key={book.id} href={book.url} target="_blank" rel="noreferrer"
                  className="submod-book-card">
                  <div className="submod-book-grade">{book.grade.replace("Secondary ", "S")}</div>
                  <div className="submod-book-icon">📄</div>
                  <div className="submod-book-info">
                    <strong>{book.title}</strong>
                    <p>{book.description}</p>
                  </div>
                  <div className="submod-book-btn">Read on Scribd →</div>
                </a>
              ))}
              <a href="/textbooks" onClick={(e) => { e.preventDefault(); navigate("/textbooks"); }}
                className="submod-book-card all">
                <div className="submod-book-icon">📚</div>
                <div className="submod-book-info">
                  <strong>All Textbooks</strong>
                  <p>Browse all subjects S1–S4</p>
                </div>
                <div className="submod-book-btn">View All →</div>
              </a>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
