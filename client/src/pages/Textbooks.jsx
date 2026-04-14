import textbooks from "../data/textbooks";

const subjectIcon = {
  Mathematics: "📐", English: "📖", Biology: "🧬", Chemistry: "⚗️",
  Physics: "⚡", History: "🏛️", Geography: "🌍", Economics: "💰",
  CRE: "✝️", Citizenship: "🇸🇸", Agriculture: "🌱", General: "📚",
  "Computer Studies": "💻", Accounting: "📊", "English Literature": "📜",
  "Fine Art": "🎨", "Additional Mathematics": "🔢",
  "Christian Religious Education": "✝️",
};

// Each subject gets its own circle color
const subjectColor = {
  English:          { bg: "#e3f2fd", border: "#1565c0", num: "#1565c0", btn: "#1565c0" },
  Mathematics:      { bg: "#fce4ec", border: "#c62828", num: "#c62828", btn: "#c62828" },
  Biology:          { bg: "#e8f5e9", border: "#2e7d32", num: "#2e7d32", btn: "#2e7d32" },
  Chemistry:        { bg: "#fff3e0", border: "#e65100", num: "#e65100", btn: "#e65100" },
  Physics:          { bg: "#f3e5f5", border: "#6a1b9a", num: "#6a1b9a", btn: "#6a1b9a" },
  History:          { bg: "#fbe9e7", border: "#bf360c", num: "#bf360c", btn: "#bf360c" },
  Geography:        { bg: "#e0f7fa", border: "#006064", num: "#006064", btn: "#006064" },
  Citizenship:      { bg: "#fff8e1", border: "#f57f17", num: "#f57f17", btn: "#f57f17" },
  "Computer Studies":{ bg: "#e8eaf6", border: "#283593", num: "#283593", btn: "#283593" },
  "Fine Art":       { bg: "#fce4ec", border: "#880e4f", num: "#880e4f", btn: "#880e4f" },
  Accounting:       { bg: "#e0f2f1", border: "#004d40", num: "#004d40", btn: "#004d40" },
  "English Literature":{ bg: "#f9fbe7", border: "#558b2f", num: "#558b2f", btn: "#558b2f" },
  Agriculture:      { bg: "#f1f8e9", border: "#33691e", num: "#33691e", btn: "#33691e" },
  "Christian Religious Education":{ bg: "#fff3e0", border: "#e65100", num: "#e65100", btn: "#e65100" },
  Economics:        { bg: "#e8f5e9", border: "#1b5e20", num: "#1b5e20", btn: "#1b5e20" },
  "Additional Mathematics":{ bg: "#fce4ec", border: "#880e4f", num: "#880e4f", btn: "#880e4f" },
};

const coreSubjects = [
  "English","Mathematics","Biology","Chemistry","Physics",
  "History","Geography","Citizenship","Computer Studies","Fine Art",
  "Accounting","English Literature","Agriculture","Christian Religious Education","Economics",
];
const naturalSubjects = [
  "English","Mathematics","Physics","Chemistry",
  "Biology","Agriculture","Christian Religious Education","Additional Mathematics",
];
const socialSubjects = [
  "English","History","Geography","Economics",
  "Mathematics","Fine Art","Accounting","English Literature","Christian Religious Education",
];

const getBook = (subject, grade) =>
  textbooks.find((b) => b.subject === subject && b.grade === grade) || null;

function BookCircle({ subject, grade }) {
  const book = getBook(subject, grade);
  const c = subjectColor[subject] || { bg: "#f5f5f5", border: "#9e9e9e", num: "#9e9e9e", btn: "#9e9e9e" };
  const gradeShort = grade.replace("Secondary ", "S");

  const icon = subject === "Citizenship"
    ? <img src="https://flagcdn.com/w40/ss.png" alt="SS Flag" style={{ width: 38, height: 26, borderRadius: 4, objectFit: "cover" }} />
    : <span style={{ fontSize: "2.2rem", lineHeight: 1 }}>{subjectIcon[subject] ?? "📚"}</span>;

  const href = book
    ? book.url
    : `https://www.scribd.com/search?query=South+Sudan+${encodeURIComponent(subject)}+${gradeShort}`;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="tb-circle-card">
      <div className="tb-circle" style={{ background: c.bg, borderColor: c.border }}>
        <div className="tb-circle-num" style={{ background: c.num }}>{gradeShort}</div>
        {icon}
      </div>
      <div className="tb-circle-label">{subject}</div>
      <div className="tb-circle-btn" style={{ background: c.btn }}>
        {book ? "📄 Read" : "🔍 Find"}
      </div>
    </a>
  );
}

function Section({ emoji, title, subtitle, headerBg, subjects, grades }) {
  return (
    <div className="tb-section">
      <div className="tb-section-head" style={{ background: headerBg }}>
        <span style={{ fontSize: "2rem" }}>{emoji}</span>
        <div>
          <h2 style={{ margin: 0, color: "white" }}>{title}</h2>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.88rem" }}>{subtitle}</p>
        </div>
      </div>
      {grades.map((grade) => (
        <div key={grade}>
          <div className="tb-grade-pill">{grade.replace("Secondary ", "Senior ")}</div>
          <div className="tb-grid">
            {subjects.map((s) => (
              <BookCircle key={s + grade} subject={s} grade={grade} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Textbooks() {
  return (
    <div className="tb-shell">
      <div className="tb-header">
        <span className="eyebrow">Official Ministry of Education — South Sudan</span>
        <h1>Textbooks &amp; PDFs</h1>
        <p>Senior 1 &amp; 2 share 15 core subjects. Senior 3 &amp; 4 split into Natural and Social Sciences streams.</p>
      </div>

      <Section
        emoji="📘" title="Senior 1 & 2 — Core Subjects"
        subtitle="15 subjects · No stream split · Same for both years"
        headerBg="linear-gradient(135deg,#0f6b5b,#0a4d41)"
        subjects={coreSubjects}
        grades={["Secondary 1","Secondary 2"]}
      />

      <Section
        emoji="🔬" title="Senior 3 & 4 — Natural Sciences"
        subtitle="8 subjects · Mathematics, Sciences, Agriculture, CRE"
        headerBg="linear-gradient(135deg,#1565c0,#0d47a1)"
        subjects={naturalSubjects}
        grades={["Secondary 3","Secondary 4"]}
      />

      <Section
        emoji="📚" title="Senior 3 & 4 — Social Sciences"
        subtitle="9 subjects · Humanities, Economics, Arts, Literature"
        headerBg="linear-gradient(135deg,#6a1b9a,#4a148c)"
        subjects={socialSubjects}
        grades={["Secondary 3","Secondary 4"]}
      />

      <a href="https://www.scribd.com/document/643349012/SS-Subject-Overviews-1-pdf"
        target="_blank" rel="noreferrer" className="tb-overview-link">
        📋 View Full South Sudan Curriculum Overview (P1 – S4) →
      </a>
    </div>
  );
}
