import { useState } from "react";
import textbooks from "../data/textbooks";

const subjectIcon = {
  Mathematics:"📐",English:"📖",Biology:"🧬",Chemistry:"⚗️",Physics:"⚡",
  History:"🏛️",Geography:"🌍",Economics:"💰",CRE:"✝️",Citizenship:"🇸🇸",
  Agriculture:"🌱",General:"📚","Computer Studies":"💻",Accounting:"📊",
  "English Literature":"📜","Fine Art":"🎨","Additional Mathematics":"🔢",
  "Christian Religious Education":"✝️",
};

const subjectColor = {
  English:{bg:"#e3f2fd",border:"#1565c0"},Mathematics:{bg:"#fce4ec",border:"#c62828"},
  Biology:{bg:"#e8f5e9",border:"#2e7d32"},Chemistry:{bg:"#fff3e0",border:"#e65100"},
  Physics:{bg:"#f3e5f5",border:"#6a1b9a"},History:{bg:"#fbe9e7",border:"#bf360c"},
  Geography:{bg:"#e0f7fa",border:"#006064"},Citizenship:{bg:"#fff8e1",border:"#f57f17"},
  "Computer Studies":{bg:"#e8eaf6",border:"#283593"},"Fine Art":{bg:"#fce4ec",border:"#880e4f"},
  Accounting:{bg:"#e0f2f1",border:"#004d40"},"English Literature":{bg:"#f9fbe7",border:"#558b2f"},
  Agriculture:{bg:"#f1f8e9",border:"#33691e"},"Christian Religious Education":{bg:"#fff3e0",border:"#e65100"},
  Economics:{bg:"#e8f5e9",border:"#1b5e20"},"Additional Mathematics":{bg:"#fce4ec",border:"#880e4f"},
};

const GRADES = ["All","Secondary 1","Secondary 2","Secondary 3","Secondary 4"];
const ALL_SUBJECTS = [...new Set([
  "English","Mathematics","Biology","Chemistry","Physics","History","Geography",
  "Citizenship","Computer Studies","Fine Art","Accounting","English Literature",
  "Agriculture","Christian Religious Education","Economics","Additional Mathematics",
])];

const coreSubjects = ["English","Mathematics","Biology","Chemistry","Physics","History","Geography","Citizenship","Computer Studies","Fine Art","Accounting","English Literature","Agriculture","Christian Religious Education","Economics"];
const naturalSubjects = ["English","Mathematics","Physics","Chemistry","Biology","Agriculture","Christian Religious Education","Additional Mathematics"];
const socialSubjects = ["English","History","Geography","Economics","Mathematics","Fine Art","Accounting","English Literature","Christian Religious Education"];

const getBook = (subject, grade) => textbooks.find((b) => b.subject === subject && b.grade === grade) || null;

function BookCircle({ subject, grade }) {
  const book = getBook(subject, grade);
  const c = subjectColor[subject] || { bg:"#f5f5f5", border:"#9e9e9e" };
  const gradeShort = grade.replace("Secondary ","S");
  const icon = subject === "Citizenship"
    ? <img src="https://flagcdn.com/w40/ss.png" alt="SS Flag" style={{width:38,height:26,borderRadius:4,objectFit:"cover"}} />
    : <span style={{fontSize:"2.2rem",lineHeight:1}}>{subjectIcon[subject]??"📚"}</span>;
  const href = book ? book.url : `https://www.scribd.com/search?query=South+Sudan+${encodeURIComponent(subject)}+${gradeShort}`;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="tb-circle-card">
      <div className="tb-circle" style={{background:c.bg,borderColor:c.border}}>
        <div className="tb-circle-num" style={{background:c.border}}>{gradeShort}</div>
        {icon}
      </div>
      <div className="tb-circle-label">{subject}</div>
      <div className="tb-circle-btn" style={{background:c.border}}>{book?"📄 Read":"🔍 Find"}</div>
    </a>
  );
}

// ── Browse by Class view ──────────────────────────────────
function ClassView({ grade }) {
  const grades = grade === "All" ? ["Secondary 1","Secondary 2","Secondary 3","Secondary 4"] : [grade];
  return (
    <div className="tb-class-view">
      {grades.map((g) => {
        const num = parseInt(g.replace("Secondary ",""));
        const isSplit = num >= 3;
        const sections = isSplit
          ? [
              { label:"🔬 Natural Sciences", subjects: naturalSubjects, color:"#1565c0" },
              { label:"📚 Social Sciences",  subjects: socialSubjects,  color:"#6a1b9a" },
            ]
          : [{ label:"📘 Core Subjects", subjects: coreSubjects, color:"#0f6b5b" }];
        return (
          <div key={g} className="tb-class-block">
            <div className="tb-class-block-header">
              <span className="tb-class-badge">{g.replace("Secondary","Senior")}</span>
              {isSplit && <span className="tb-class-stream-note">Stream split</span>}
            </div>
            {sections.map((sec) => (
              <div key={sec.label} className="tb-stream-block">
                <div className="tb-stream-label" style={{background:sec.color}}>{sec.label}</div>
                <div className="tb-grid">
                  {sec.subjects.map((s) => <BookCircle key={s+g} subject={s} grade={g} />)}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Browse by Subject view ────────────────────────────────
function SubjectView({ subject }) {
  const subjects = subject === "All" ? ALL_SUBJECTS : [subject];
  const allGrades = ["Secondary 1","Secondary 2","Secondary 3","Secondary 4"];
  return (
    <div className="tb-subject-view">
      {subjects.map((s) => {
        const c = subjectColor[s] || {bg:"#f5f5f5",border:"#9e9e9e"};
        return (
          <div key={s} className="tb-subject-block">
            <div className="tb-subject-block-header" style={{borderLeftColor:c.border}}>
              <span style={{fontSize:"1.8rem"}}>{subjectIcon[s]??"📚"}</span>
              <div>
                <strong>{s}</strong>
                <span>All grades</span>
              </div>
            </div>
            <div className="tb-grid">
              {allGrades.map((g) => <BookCircle key={s+g} subject={s} grade={g} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Textbooks() {
  const [tab, setTab] = useState("class");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const TABS = [
    { key:"class",   label:"🏫 Browse by Class" },
    { key:"subject", label:"📚 Browse by Subject" },
  ];

  return (
    <div className="tb-shell">
      <div className="tb-header">
        <span className="eyebrow">Official Ministry of Education — South Sudan</span>
        <h1>Textbooks &amp; PDFs</h1>
        <p>Browse official South Sudan secondary textbooks. Filter by class or subject to find what you need.</p>
      </div>

      <div className="cat-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`cat-tab${tab===t.key?" active":""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "class" && (
        <div className="cat-filter-row">
          <span className="filter-label">Class:</span>
          <div className="filter-row">
            {GRADES.map((g) => (
              <button key={g} className={`filter-pill${selectedGrade===g?" active":""}`} onClick={() => setSelectedGrade(g)}>
                {g === "All" ? "All Classes" : g.replace("Secondary","Senior")}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "subject" && (
        <div className="cat-filter-row">
          <span className="filter-label">Subject:</span>
          <div className="filter-row">
            <button className={`filter-pill${selectedSubject==="All"?" active":""}`} onClick={() => setSelectedSubject("All")}>All Subjects</button>
            {ALL_SUBJECTS.map((s) => (
              <button key={s} className={`filter-pill${selectedSubject===s?" active":""}`} onClick={() => setSelectedSubject(s)}>
                {subjectIcon[s]} {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "class"   && <ClassView   grade={selectedGrade} />}
      {tab === "subject" && <SubjectView subject={selectedSubject} />}

      <a href="https://www.scribd.com/document/643349012/SS-Subject-Overviews-1-pdf"
        target="_blank" rel="noreferrer" className="tb-overview-link">
        📋 View Full South Sudan Curriculum Overview (P1–S4) →
      </a>
    </div>
  );
}
