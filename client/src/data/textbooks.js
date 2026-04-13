// Official South Sudan Ministry of General Education & Instruction textbooks
// sourced from Scribd. Links open the Scribd reader where students can read online or download.
const textbooks = [
  // ── Mathematics ──────────────────────────────────────────
  {
    id: 1,
    subject: "Mathematics",
    grade: "Secondary 3",
    title: "Secondary Mathematics 3",
    description: "Covers the Secondary 3 national syllabus — algebra, trigonometry, and statistics.",
    url: "https://www.scribd.com/document/677856830/Secondary-Mathematics-3-Student-Textbook",
  },
  {
    id: 2,
    subject: "Mathematics",
    grade: "Secondary 4",
    title: "Secondary Mathematics 4",
    description: "Advanced mathematics for Secondary 4 — calculus, vectors, and exam preparation.",
    url: "https://www.scribd.com/document/677856927/Secondary-Mathematics-4-Student-Textbook",
  },

  // ── Biology ───────────────────────────────────────────────
  {
    id: 3,
    subject: "Biology",
    grade: "Secondary 4",
    title: "Secondary Biology 4",
    description: "Biotechnology, disease, advanced genetics — full Secondary 4 syllabus.",
    url: "https://www.scribd.com/document/810431791/Secondary-Biology-4-Student-Textbook",
  },
  {
    id: 4,
    subject: "Biology",
    grade: "Secondary 4",
    title: "Biology Pupil's Book S4",
    description: "Official Biology pupil's book covering the complete S4 curriculum.",
    url: "https://www.scribd.com/document/690212310/Biology-Pupil-s-Book-S4",
  },

  // ── Chemistry ─────────────────────────────────────────────
  {
    id: 5,
    subject: "Chemistry",
    grade: "Secondary 2",
    title: "Secondary Chemistry 2",
    description: "Organic chemistry, reactions, and stoichiometry for Secondary 2.",
    url: "https://www.scribd.com/document/718237729/Secpndary-Chemistry-2-Student-Textbook",
  },
  {
    id: 6,
    subject: "Chemistry",
    grade: "Secondary 4",
    title: "Secondary Chemistry 4",
    description: "Industrial chemistry, polymers, and advanced reactions for Secondary 4.",
    url: "https://www.scribd.com/document/706288699/Secpndary-Chemistry-4-Student-Textbook",
  },

  // ── Physics ───────────────────────────────────────────────
  {
    id: 7,
    subject: "Physics",
    grade: "Secondary 1",
    title: "Secondary Physics 1",
    description: "Mechanics, waves, and basic electricity — Secondary 1 syllabus.",
    url: "https://www.scribd.com/document/706288858/Secondary-Physics-1-Student-Textbook",
  },

  // ── History ───────────────────────────────────────────────
  {
    id: 8,
    subject: "History",
    grade: "Secondary 2",
    title: "Secondary History 2",
    description: "Colonial era, independence movements, and modern Africa.",
    url: "https://www.scribd.com/document/768555691/Secondary-History-2-Student-Textbook",
  },
  {
    id: 9,
    subject: "History",
    grade: "Secondary 4",
    title: "Secondary History 4",
    description: "Contemporary world history and exam preparation for Secondary 4.",
    url: "https://www.scribd.com/document/773399720/Secondary-History-4-Student-Textbook",
  },

  // ── Geography ─────────────────────────────────────────────
  {
    id: 10,
    subject: "Geography",
    grade: "Secondary 1",
    title: "Secondary Geography 1",
    description: "Physical geography, maps, and climate — Secondary 1 syllabus.",
    url: "https://www.scribd.com/document/736235964/Secondary-Geography-1-Student-Textbook",
  },
  {
    id: 11,
    subject: "Geography",
    grade: "Secondary 3",
    title: "Secondary Geography 3",
    description: "Transport, communication, trade, and human geography for Secondary 3.",
    url: "https://www.scribd.com/document/720263635/Secondary-Geography-3-Student-Textbook",
  },

  // ── CRE ───────────────────────────────────────────────────
  {
    id: 12,
    subject: "CRE",
    grade: "Secondary 1",
    title: "Secondary CRE 1",
    description: "Christian Religious Education — faith, values, and community for Secondary 1.",
    url: "https://www.scribd.com/document/781334560/Secondary-CRE-1-Student-Textbook",
  },

  // ── Citizenship ───────────────────────────────────────────
  {
    id: 13,
    subject: "Citizenship",
    grade: "Secondary 2",
    title: "Secondary Citizenship 2",
    description: "Rights, responsibilities, governance, and civic participation.",
    url: "https://www.scribd.com/document/828623353/Secondary-Citizenship-2-Student-Textbook-1",
  },

  // ── Curriculum Overview ───────────────────────────────────
  {
    id: 14,
    subject: "General",
    grade: "All Levels",
    title: "South Sudan Subject Overviews",
    description: "Official overview of all subjects from Primary 1 to Secondary 4 by the Ministry of Education.",
    url: "https://www.scribd.com/document/643349012/SS-Subject-Overviews-1-pdf",
  },
];

export default textbooks;
