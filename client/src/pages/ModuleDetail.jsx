import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { subjectModules } from "../data/curriculum";

// ── Rich notes per module title ──────────────────────────
const NOTES = {
  "Reading Comprehension": { body: "Reading comprehension means understanding what you read. Always read the passage twice: first for general meaning, then for details. Look for the main idea in the first or last sentence of each paragraph. Answer questions using evidence from the text.", points: ["Identify the main idea of each paragraph", "Look for key words in questions", "Use context clues for unknown words", "Always support answers with text evidence"], summary: "Good readers read actively, ask questions, and connect ideas. Practice daily to improve speed and understanding." },
  "Grammar & Sentence Structure": { body: "Grammar governs how we use language. A sentence must have a subject and a verb. Types: simple (one clause), compound (two clauses joined by and/but/or), complex (main + subordinate clause).", points: ["Subject + Verb + Object is the basic structure", "Use commas to separate clauses", "Avoid run-on sentences", "Keep tenses consistent"], summary: "Correct grammar makes writing clear and professional. Always proofread your work." },
  "Essay Writing": { body: "An essay has three parts: Introduction (state your argument), Body (3+ paragraphs with evidence), Conclusion (summarise your points). Each body paragraph starts with a topic sentence.", points: ["Plan before writing", "Each paragraph = one main idea", "Use linking words: however, therefore, furthermore", "Conclude by restating your argument"], summary: "A well-structured essay shows clear thinking. Practice writing one essay per week." },
  "Numbers & Numeration": { body: "Numbers are the foundation of mathematics. Natural numbers (1,2,3...), integers, rational numbers (fractions), irrational numbers. Place value: each digit has a value based on its position.", points: ["Understand place value up to millions", "Convert between fractions, decimals, percentages", "Know BODMAS/PEMDAS rules", "Practice mental arithmetic daily"], summary: "Strong number skills are essential for all areas of mathematics." },
  "Algebra": { body: "Algebra uses letters (variables) to represent unknown values. To solve 2x + 5 = 13: subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4. Always do the same operation to both sides.", points: ["Collect like terms before solving", "Use inverse operations to isolate the variable", "Check your answer by substituting back", "Factorise expressions to simplify"], summary: "Algebra is used in science, engineering, and everyday problem solving." },
  "Cell Biology": { body: "The cell is the basic unit of life. Plant cells have: cell wall, chloroplasts, large vacuole. Animal cells have: no cell wall, no chloroplasts, small vacuoles. Both have: nucleus, cytoplasm, cell membrane, mitochondria.", points: ["Cell membrane controls what enters and leaves", "Nucleus contains DNA and controls cell activities", "Mitochondria produce energy (ATP)", "Chloroplasts contain chlorophyll for photosynthesis"], summary: "Understanding cell structure explains how all living organisms function." },
  "Atomic Structure": { body: "An atom has a nucleus (protons + neutrons) surrounded by electrons in shells. Atomic number = number of protons. Mass number = protons + neutrons. Isotopes are atoms of the same element with different neutron numbers.", points: ["Protons are positively charged", "Electrons are negatively charged", "Neutrons have no charge", "Electrons fill shells: 2, 8, 8, 18..."], summary: "Atomic structure explains chemical bonding, reactions, and properties of all elements." },
  "Mechanics & Motion": { body: "Speed = distance/time. Velocity = speed in a specific direction. Acceleration = change in velocity/time. Newton Laws: 1) Objects stay at rest unless a force acts. 2) F = ma. 3) Every action has an equal and opposite reaction.", points: ["Distance-time graphs: gradient = speed", "Velocity-time graphs: gradient = acceleration", "F = ma is the most important formula", "Weight = mass x gravitational field strength"], summary: "Mechanics is the foundation of physics. Master the formulas and practice graph interpretation." },
  "Pre-Colonial Africa": { body: "Before European colonisation, Africa had powerful kingdoms. Great Zimbabwe (1100-1450 AD) was a major trading empire. The Mali Empire was famous for gold and salt trade. The Kingdom of Kush in Sudan was one of the earliest civilisations.", points: ["Africa had advanced civilisations before colonisation", "Trade routes connected sub-Saharan Africa to North Africa", "The Nile Valley civilisations influenced world history", "South Sudan was home to the Nilotic peoples with rich cultures"], summary: "Africa pre-colonial history shows a continent of innovation, trade, and complex societies." },
  "Maps & Map Reading": { body: "A map is a scaled representation of the Earth surface. Key elements: title, scale, key/legend, north arrow, grid references. Scale shows the ratio between map distance and real distance. Contour lines show elevation.", points: ["Grid references: go along (easting) then up (northing)", "Scale 1:50,000 means 1cm = 500m in reality", "Contour lines never cross each other", "Relief maps show hills, valleys, and plains"], summary: "Map reading is an essential life skill used in geography, travel, and planning." },
  "Rights & Responsibilities": { body: "Citizens have both rights and responsibilities. Rights include: education, healthcare, freedom of speech, fair trial. Responsibilities include: obeying laws, paying taxes, respecting others, participating in elections.", points: ["The South Sudan Constitution guarantees basic rights", "Rights come with responsibilities", "Children have special rights under the UN Convention", "Citizenship means actively participating in your community"], summary: "Understanding rights and responsibilities helps build a peaceful and just society." },
  "Basic Economic Concepts": { body: "Economics studies how people use limited resources to satisfy unlimited wants. Key concepts: scarcity (limited resources), opportunity cost (what you give up), factors of production (land, labour, capital, enterprise).", points: ["Scarcity is the fundamental economic problem", "Opportunity cost = the next best alternative given up", "Goods are physical; services are non-physical", "Microeconomics studies individuals; macroeconomics studies the whole economy"], summary: "Economics helps us understand how decisions are made at individual, business, and national levels." },
};

const getNote = (subject, title) => NOTES[title] || {
  body: `This module covers ${title} as part of the ${subject} curriculum for South Sudan secondary students. Study the key concepts carefully, complete the practice questions, and use the quiz to test your understanding.`,
  points: ["Read through all notes carefully", "Write down key definitions in your notebook", "Try to explain the concept in your own words", "Complete all practice questions", "Review before the quiz"],
  summary: `${title} is an important topic in ${subject}. Master these concepts to build a strong foundation for your exams.`,
};

// ── Q&A per module ───────────────────────────────────────
const getQA = (subject, title) => [
  { q: `What is the main idea of ${title}?`, a: `${title} is a core topic in ${subject} covering fundamental concepts needed for the South Sudan secondary curriculum. Understanding this topic helps students build knowledge for higher-level study and national examinations.` },
  { q: `How does ${title} apply in real life?`, a: `The concepts in ${title} are used in everyday life. In ${subject}, these ideas help explain natural phenomena, solve practical problems, and develop critical thinking skills valuable in any career.` },
  { q: "What are the most important points to remember?", a: "Focus on: 1) Key definitions and terminology. 2) The main principles or rules. 3) How to apply concepts to solve problems. 4) Common exam question types for this topic." },
  { q: "How should I prepare for the exam on this topic?", a: "To prepare: 1) Re-read your notes and highlight key points. 2) Write a one-page summary from memory. 3) Complete the module quiz. 4) Look at past exam papers. 5) Ask the AI tutor to explain anything difficult." },
];

// ── Quiz per module ──────────────────────────────────────
const QUIZZES = {
  "Cell Biology": [
    { q: "What is the basic unit of life?", options: ["Atom", "Cell", "Tissue", "Organ"], answer: 1 },
    { q: "Which organelle controls the cell activities?", options: ["Mitochondria", "Vacuole", "Nucleus", "Cell wall"], answer: 2 },
    { q: "Which structure is found in plant cells but NOT animal cells?", options: ["Nucleus", "Cell membrane", "Cell wall", "Mitochondria"], answer: 2 },
    { q: "Where does photosynthesis take place?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Vacuole"], answer: 2 },
    { q: "What does the mitochondria produce?", options: ["Glucose", "Oxygen", "ATP (energy)", "Carbon dioxide"], answer: 2 },
  ],
  "Atomic Structure": [
    { q: "What is found in the nucleus of an atom?", options: ["Electrons only", "Protons and neutrons", "Neutrons only", "Electrons and protons"], answer: 1 },
    { q: "What charge do electrons have?", options: ["Positive", "Negative", "Neutral", "No charge"], answer: 1 },
    { q: "The atomic number equals the number of:", options: ["Neutrons", "Electrons", "Protons", "Isotopes"], answer: 2 },
    { q: "How many electrons fit in the first shell?", options: ["8", "4", "2", "18"], answer: 2 },
    { q: "Isotopes of the same element have the same number of:", options: ["Neutrons", "Mass numbers", "Protons", "Electrons in outer shell"], answer: 2 },
  ],
  "Mechanics & Motion": [
    { q: "What is the formula for speed?", options: ["Speed = time/distance", "Speed = distance x time", "Speed = distance/time", "Speed = force/mass"], answer: 2 },
    { q: "Newton Second Law states Force equals:", options: ["Mass + Acceleration", "Mass x Velocity", "Mass x Acceleration", "Weight x Height"], answer: 2 },
    { q: "A flat line on a distance-time graph means:", options: ["Constant speed", "Acceleration", "The object is stationary", "Deceleration"], answer: 2 },
    { q: "Weight is calculated as:", options: ["W = m + g", "W = m/g", "W = m x g", "W = g/m"], answer: 2 },
    { q: "Newton Third Law says every action has:", options: ["A greater reaction", "No reaction", "An equal and opposite reaction", "A smaller reaction"], answer: 2 },
  ],
  "Algebra": [
    { q: "Solve: 2x + 4 = 10", options: ["x = 7", "x = 3", "x = 5", "x = 2"], answer: 1 },
    { q: "Simplify: 3x + 2x", options: ["6x", "5x", "5x squared", "x to the 5"], answer: 1 },
    { q: "What is x in: x - 5 = 12?", options: ["7", "17", "60", "5"], answer: 1 },
    { q: "Factorise: 6x + 9", options: ["3(2x + 3)", "6(x + 3)", "2(3x + 9)", "9(x + 6)"], answer: 0 },
    { q: "Solve: 3x = 15", options: ["x = 45", "x = 12", "x = 5", "x = 18"], answer: 2 },
  ],
  "Numbers & Numeration": [
    { q: "What is 25% of 200?", options: ["25", "50", "75", "100"], answer: 1 },
    { q: "Which is the correct order of operations?", options: ["ABCDE", "BODMAS", "RANDOM", "SIMPLE"], answer: 1 },
    { q: "What is 3/4 as a decimal?", options: ["0.34", "0.43", "0.75", "0.25"], answer: 2 },
    { q: "What is the place value of 5 in 3,500?", options: ["Ones", "Tens", "Hundreds", "Thousands"], answer: 2 },
    { q: "What is the LCM of 4 and 6?", options: ["2", "8", "12", "24"], answer: 2 },
  ],
};

const getQuiz = (title) => QUIZZES[title] || [
  { q: "Which best describes this module topic?", options: ["A minor topic", "A core curriculum concept", "Only for university", "Not in exams"], answer: 1 },
  { q: "What is the best way to study this subject?", options: ["Read once", "Notes, videos, and quizzes", "Only memorise", "Skip hard topics"], answer: 1 },
  { q: "Which tool helps most when you do not understand a topic?", options: ["Ignoring it", "The AI Tutor", "Guessing", "Copying"], answer: 1 },
  { q: "How many times should you review notes before an exam?", options: ["Never", "Once", "Multiple times", "Only on exam day"], answer: 2 },
  { q: "What should you do after completing a module?", options: ["Move on immediately", "Take the quiz", "Skip the quiz", "Start a new subject"], answer: 1 },
];

export default function ModuleDetail() {
  const { subject, classId, moduleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const decoded = decodeURIComponent(subject);
  const modules = subjectModules[decoded] || [];
  const modIndex = parseInt(moduleId, 10) - 1;
  const mod = modules[modIndex] || modules[0];
  const note = getNote(decoded, mod?.title || "");
  const qaList = getQA(decoded, mod?.title || "");
  const quizList = getQuiz(mod?.title || "");
  const [tab, setTab] = useState(searchParams.get("tab") || "notes");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { setAnswers({}); setSubmitted(false); }, [moduleId]);

  const score = submitted ? quizList.filter((q, i) => answers[i] === q.answer).length : 0;
  const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(decoded + " " + (mod?.title || "") + " lesson")}`;
  const videoId = mod?.videoId;

  const TABS = [
    { key: "notes", label: "📖 Notes" },
    { key: "video", label: "🎥 Video" },
    { key: "qa",    label: "❓ Q&A" },
    { key: "quiz",  label: "📝 Quiz" },
    { key: "ai",    label: "🤖 AI Help" },
  ];

  return (
    <div className="moddetail-shell">

      {/* Header */}
      <div className="moddetail-header">
        <button className="streams-back" onClick={() => navigate(`/subject/${encodeURIComponent(decoded)}/${classId}`)}>
          ← Back to {decoded}
        </button>
        <span className="eyebrow" style={{ display:"block", marginTop:8 }}>{decoded} · Senior {classId} · Module {moduleId}</span>
        <h1 style={{ margin:"4px 0 0" }}>{mod?.title}</h1>
      </div>

      {/* Tabs */}
      <div className="moddetail-tabs">
        {TABS.map((t) => (
          <button key={t.key}
            className={`moddetail-tab${tab === t.key ? " active" : ""}`}
            onClick={() => { setTab(t.key); setSubmitted(false); }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="moddetail-content">

        {/* ── NOTES ── */}
        {tab === "notes" && (
          <div className="notes-page">

            {/* Hero banner */}
            <div className="notes-hero">
              <span className="eyebrow">{decoded} · Senior {classId} · Module {moduleId}</span>
              <h2>{mod?.title}</h2>
              <p>{note.body}</p>
            </div>

            {/* Definition highlight */}
            <div className="notes-definition-block">
              <h3>📌 Definition</h3>
              <p><strong>{mod?.title}</strong> — {note.summary}</p>
            </div>

            {/* Key points + example */}
            <div className="notes-section-grid">
              <div className="notes-box green">
                <h3>✅ Key Points to Remember</h3>
                <ul>
                  {note.points.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="notes-box blue">
                <h3>📚 How to Study This Topic</h3>
                <ul>
                  <li>Read the notes carefully at least twice</li>
                  <li>Write key definitions in your notebook</li>
                  <li>Draw diagrams where helpful</li>
                  <li>Explain the concept to a friend</li>
                  <li>Complete the quiz to test yourself</li>
                </ul>
              </div>
            </div>

            {/* Example block */}
            <div className="notes-example-block">
              <h3>💡 Worked Example</h3>
              <p>
                Apply the concepts of <strong>{mod?.title}</strong> by working through past exam questions.
                Start with simple examples, then move to complex problems. Always show your working clearly
                and check your answer against the key points above.
              </p>
            </div>

            {/* Exam tips */}
            <div className="notes-section-grid">
              <div className="notes-box orange">
                <h3>⚠️ Common Exam Mistakes</h3>
                <ul>
                  <li>Not reading the question carefully</li>
                  <li>Forgetting to show working</li>
                  <li>Mixing up key terms and definitions</li>
                  <li>Running out of time — practice speed</li>
                </ul>
              </div>
              <div className="notes-box purple">
                <h3>🎯 Exam Tips</h3>
                <ul>
                  <li>Learn all key definitions by heart</li>
                  <li>Practice past paper questions</li>
                  <li>Use the AI tutor for difficult parts</li>
                  <li>Review this module the night before</li>
                </ul>
              </div>
            </div>

            {/* Summary banner */}
            <div className="notes-summary-banner">
              <span>📋</span>
              <p>
                <strong>Summary:</strong> {note.summary} This topic is part of the official
                South Sudan Ministry of Education curriculum for Senior {classId} {decoded}.
                Master it to build a strong foundation for your national examinations.
              </p>
            </div>

            {/* Navigation */}
            <div className="notes-nav-row">
              {modIndex > 0 && (
                <button className="ghost-button"
                  onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/${modIndex}`)}>
                  ← Previous Module
                </button>
              )}
              <button className="primary-button" onClick={() => setTab("quiz")}>
                📝 Take Quiz Now
              </button>
              <button className="moddetail-submit-btn" style={{ background:"#e65100", padding:"12px 20px" }}
                onClick={() => setTab("video")}>
                🎥 Watch Video
              </button>
              {modIndex < modules.length - 1 && (
                <button className="primary-button"
                  onClick={() => navigate(`/module/${encodeURIComponent(decoded)}/${classId}/${modIndex + 2}`)}>
                  Next Module →
                </button>
              )}
            </div>

          </div>
        )}
        )}

        {/* ── VIDEO ── */}
        {tab === "video" && (
          <div className="moddetail-video">
            <h2 style={{ marginBottom:8 }}>🎥 {mod?.title}</h2>
            <p style={{ color:"var(--muted)", marginBottom:16 }}>Watch the tutorial video for this module below.</p>
            {videoId && (
              <div className="moddetail-yt-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                  title={mod.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <a href={ytSearch} target="_blank" rel="noreferrer" className="moddetail-yt-btn" style={{ marginTop:16, display:"inline-flex" }}>
              🔍 Search More Videos on YouTube
            </a>
          </div>
        )}

        {/* ── Q&A ── */}
        {tab === "qa" && (
          <div className="moddetail-qa">
            <h2 style={{ marginBottom:16 }}>❓ Discussion Questions & Answers</h2>
            {qaList.map((item, i) => (
              <div key={i} className="moddetail-qa-item">
                <div className="moddetail-qa-q">Q{i+1}: {item.q}</div>
                <div className="moddetail-qa-a">💡 {item.a}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── QUIZ ── */}
        {tab === "quiz" && (
          <div className="moddetail-quiz">
            <h2 style={{ marginBottom:4 }}>📝 Quiz — {mod?.title}</h2>
            <p style={{ color:"var(--muted)", marginBottom:20 }}>Answer all {quizList.length} questions then click Submit.</p>
            {!submitted ? (
              <>
                {quizList.map((q, i) => (
                  <div key={i} className="moddetail-quiz-q">
                    <p><strong>Q{i+1}.</strong> {q.q}</p>
                    <div className="moddetail-quiz-options">
                      {q.options.map((opt, j) => (
                        <button key={j}
                          className={`moddetail-quiz-opt${answers[i] === j ? " selected" : ""}`}
                          onClick={() => setAnswers({ ...answers, [i]: j })}>
                          {String.fromCharCode(65+j)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="moddetail-submit-btn"
                  onClick={() => setSubmitted(true)}
                  disabled={Object.keys(answers).length < quizList.length}>
                  Submit Quiz ({Object.keys(answers).length}/{quizList.length} answered)
                </button>
              </>
            ) : (
              <div className="moddetail-result">
                <div className="moddetail-score" style={{ color: score >= quizList.length * 0.6 ? "#2e7d32" : "#c62828" }}>
                  {score}/{quizList.length}
                </div>
                <p style={{ fontSize:"1.2rem", fontWeight:700 }}>
                  {score === quizList.length ? "🎉 Perfect! Excellent work!" : score >= quizList.length * 0.6 ? "👍 Good job! Keep studying." : "📖 Review the notes and try again."}
                </p>
                <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginTop:16 }}>
                  <button className="moddetail-submit-btn" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try Again</button>
                  <button className="moddetail-submit-btn" style={{ background:"#0f6b5b" }} onClick={() => setTab("notes")}>Review Notes</button>
                </div>
                <div style={{ marginTop:24, textAlign:"left" }}>
                  <h3 style={{ marginBottom:12 }}>Answer Review:</h3>
                  {quizList.map((q, i) => (
                    <div key={i} className={`review-item ${answers[i] === q.answer ? "correct" : "wrong"}`} style={{ marginBottom:10 }}>
                      <strong>{answers[i] === q.answer ? "✅" : "❌"} Q{i+1}: {q.q}</strong>
                      <p style={{ margin:"4px 0 0", color:"var(--muted)" }}>
                        Your answer: <strong>{q.options[answers[i]] || "Not answered"}</strong> | Correct: <strong style={{ color:"#2e7d32" }}>{q.options[q.answer]}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI HELP ── */}
        {tab === "ai" && (
          <div style={{ display:"grid", gap:16 }}>
            <h2>🤖 Ask the AI Tutor about {mod?.title}</h2>
            <p style={{ color:"var(--muted)" }}>The AI tutor can explain this topic, give examples, or help you prepare for the exam.</p>
            <button className="primary-button" style={{ justifySelf:"start", padding:"14px 28px" }}
              onClick={() => navigate("/chat")}>
              Open AI Tutor Chat →
            </button>
            <div style={{ background:"var(--surface-soft)", borderRadius:"var(--radius-md)", padding:20 }}>
              <p style={{ fontWeight:700, marginBottom:8 }}>Suggested questions to ask:</p>
              <ul style={{ color:"var(--muted)", lineHeight:2.2, paddingLeft:20 }}>
                <li>Explain {mod?.title} in simple words</li>
                <li>Give me examples of {mod?.title}</li>
                <li>What are the key formulas for {mod?.title}?</li>
                <li>How does {mod?.title} appear in exams?</li>
                <li>Summarise {mod?.title} for revision</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
