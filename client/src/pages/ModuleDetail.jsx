import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { subjectModules } from "../data/curriculum";

// Sample notes content per module index
const sampleNotes = [
  "This module introduces the foundational concepts of the subject. Students will explore key definitions, historical background, and real-world applications. Work through each section carefully and use the discussion questions to test your understanding.",
  "In this module, we build on the basics and explore more advanced ideas. Pay attention to the worked examples and try the practice exercises before moving to the quiz.",
  "This module covers practical applications. Understanding these concepts will help you in exams and in everyday life. Review the summary at the end of each section.",
  "This module focuses on analysis and critical thinking. Use the AI assistant to get summaries or ask questions about anything you find difficult.",
  "This module prepares you for the end-of-topic assessment. Review all previous modules and use the quiz to check your readiness.",
  "This final module brings together everything you have learned. Complete the quiz and discuss your answers with classmates or the AI tutor.",
];

const sampleQA = [
  { q: "What is the main concept of this module?", a: "The main concept covers the foundational principles that form the basis of this topic in the South Sudan curriculum." },
  { q: "How does this topic apply in real life?", a: "This topic has many real-world applications including problem solving, critical thinking, and practical skills used in daily life and future careers." },
  { q: "What should I focus on for the exam?", a: "Focus on key definitions, worked examples, and practice questions. Use the AI tutor to get summaries of difficult sections." },
];

const sampleQuiz = [
  { q: "Which of the following best describes the main idea of this module?", options: ["Option A", "Option B", "Option C", "Option D"], answer: 0 },
  { q: "What is the correct approach to solving problems in this topic?", options: ["Guess randomly", "Apply learned formulas", "Skip difficult parts", "Copy from others"], answer: 1 },
  { q: "Which resource helps most with understanding difficult concepts?", options: ["AI Tutor", "Ignoring it", "Only reading once", "None"], answer: 0 },
];

export default function ModuleDetail() {
  const { subject, classId, moduleId } = useParams();
  const decoded = decodeURIComponent(subject);
  const modules = subjectModules[decoded] || [];
  const mod = modules[parseInt(moduleId, 10) - 1] || modules[0];
  const noteText = sampleNotes[(parseInt(moduleId, 10) - 1) % sampleNotes.length];

  const [tab, setTab] = useState("notes");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? sampleQuiz.filter((q, i) => answers[i] === q.answer).length
    : 0;

  return (
    <div className="moddetail-shell">

      {/* Header */}
      <div className="moddetail-header">
        <Link to={`/subject/${encodeURIComponent(decoded)}/${classId}`} className="streams-back">← Back to {decoded}</Link>
        <h1>{mod?.title}</h1>
        <span className="eyebrow">{decoded} · Senior {classId}</span>
      </div>

      {/* Tab bar */}
      <div className="moddetail-tabs">
        {[
          { key: "notes", label: "📖 Notes" },
          { key: "video", label: "🎥 Video" },
          { key: "qa", label: "❓ Q&A" },
          { key: "quiz", label: "📝 Quiz" },
        ].map((t) => (
          <button
            key={t.key}
            className={`moddetail-tab${tab === t.key ? " active" : ""}`}
            onClick={() => { setTab(t.key); setSubmitted(false); }}
          >
            {t.label}
          </button>
        ))}
        <Link to="/chat" className="moddetail-tab ai-tab">🤖 AI Help</Link>
      </div>

      {/* Tab content */}
      <div className="moddetail-content">

        {tab === "notes" && (
          <div className="moddetail-notes">
            <h2>{mod?.title}</h2>
            <p>{noteText}</p>
            <div className="moddetail-note-sections">
              <div className="moddetail-note-block">
                <h3>📌 Key Concepts</h3>
                <ul>
                  <li>Understand the core definitions and terminology</li>
                  <li>Study the worked examples carefully</li>
                  <li>Apply concepts to practice problems</li>
                  <li>Review the summary before the quiz</li>
                </ul>
              </div>
              <div className="moddetail-note-block">
                <h3>📋 Summary</h3>
                <p>
                  This module is part of the {decoded} curriculum for Senior {classId} students in South Sudan.
                  Master these concepts to build a strong foundation for your exams and future studies.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "video" && (
          <div className="moddetail-video">
            <p className="moddetail-video-note">
              Watch the tutorial video for <strong>{mod?.title}</strong> on YouTube.
            </p>
            <a
              href={`https://www.youtube.com/results?search_query=South+Sudan+${encodeURIComponent(decoded)}+${encodeURIComponent(mod?.title || "")}`}
              target="_blank"
              rel="noreferrer"
              className="moddetail-yt-btn"
            >
              ▶ Open YouTube Tutorial
            </a>
            <div className="moddetail-yt-placeholder">
              <span>🎥</span>
              <p>Click the button above to watch the tutorial on YouTube</p>
            </div>
          </div>
        )}

        {tab === "qa" && (
          <div className="moddetail-qa">
            <h2>Discussion Questions & Answers</h2>
            {sampleQA.map((item, i) => (
              <div key={i} className="moddetail-qa-item">
                <div className="moddetail-qa-q">❓ {item.q}</div>
                <div className="moddetail-qa-a">💡 {item.a}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "quiz" && (
          <div className="moddetail-quiz">
            <h2>📝 Module Quiz</h2>
            {!submitted ? (
              <>
                {sampleQuiz.map((q, i) => (
                  <div key={i} className="moddetail-quiz-q">
                    <p><strong>Q{i + 1}.</strong> {q.q}</p>
                    <div className="moddetail-quiz-options">
                      {q.options.map((opt, j) => (
                        <button
                          key={j}
                          className={`moddetail-quiz-opt${answers[i] === j ? " selected" : ""}`}
                          onClick={() => setAnswers({ ...answers, [i]: j })}
                        >
                          {String.fromCharCode(65 + j)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  className="moddetail-submit-btn"
                  onClick={() => setSubmitted(true)}
                  disabled={Object.keys(answers).length < sampleQuiz.length}
                >
                  Submit Quiz
                </button>
              </>
            ) : (
              <div className="moddetail-result">
                <div className="moddetail-score">{score}/{sampleQuiz.length}</div>
                <p>{score === sampleQuiz.length ? "🎉 Perfect score!" : score >= 2 ? "👍 Good job!" : "📖 Review the notes and try again."}</p>
                <button className="moddetail-submit-btn" onClick={() => { setAnswers({}); setSubmitted(false); }}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
