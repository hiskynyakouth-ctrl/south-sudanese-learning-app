// Official South Sudan Ministry of General Education & Instruction Textbooks
// All links verified from Scribd — written & developed by the Government of South Sudan.
// Grades without a confirmed public link are marked with available: false.
// Replace url with a real link when you find or upload the PDF.

const textbooks = [

  // ══════════════════════════════════════════
  // MATHEMATICS
  // ══════════════════════════════════════════
  {
    id: "math-1", subject: "Mathematics", grade: "Secondary 1",
    title: "Secondary Mathematics 1",
    description: "Numbers, algebra, and geometry foundations for Secondary 1.",
    available: false, url: null,
  },
  {
    id: "math-2", subject: "Mathematics", grade: "Secondary 2",
    title: "Secondary Mathematics 2",
    description: "Algebra, statistics, and trigonometry for Secondary 2.",
    available: false, url: null,
  },
  {
    id: "math-3", subject: "Mathematics", grade: "Secondary 3",
    title: "Secondary Mathematics 3",
    description: "Advanced algebra, vectors, and calculus basics for Secondary 3.",
    available: true,
    url: "https://www.scribd.com/document/677856830/Secondary-Mathematics-3-Student-Textbook",
  },
  {
    id: "math-4", subject: "Mathematics", grade: "Secondary 4",
    title: "Secondary Mathematics 4",
    description: "Calculus, probability, and exam preparation for Secondary 4.",
    available: true,
    url: "https://www.scribd.com/document/677856927/Secondary-Mathematics-4-Student-Textbook",
  },

  // ══════════════════════════════════════════
  // BIOLOGY
  // ══════════════════════════════════════════
  {
    id: "bio-1", subject: "Biology", grade: "Secondary 1",
    title: "Secondary Biology 1",
    description: "Cell biology, ecology, and basic life processes.",
    available: false, url: null,
  },
  {
    id: "bio-2", subject: "Biology", grade: "Secondary 2",
    title: "Secondary Biology 2",
    description: "Human anatomy, reproduction, and genetics.",
    available: false, url: null,
  },
  {
    id: "bio-3", subject: "Biology", grade: "Secondary 3",
    title: "Secondary Biology 3 (Teacher's Guide)",
    description: "Classification, ecosystems, and advanced biology — Secondary 3.",
    available: true,
    url: "https://www.scribd.com/document/844538718/O-level-Biology",
  },
  {
    id: "bio-4a", subject: "Biology", grade: "Secondary 4",
    title: "Secondary Biology 4 — Student Textbook",
    description: "Biotechnology, disease, and advanced genetics for Secondary 4.",
    available: true,
    url: "https://www.scribd.com/document/810431791/Secondary-Biology-4-Student-Textbook",
  },
  {
    id: "bio-4b", subject: "Biology", grade: "Secondary 4",
    title: "Biology Pupil's Book S4",
    description: "Official Biology pupil's book — complete S4 curriculum.",
    available: true,
    url: "https://www.scribd.com/document/690212310/Biology-Pupil-s-Book-S4",
  },

  // ══════════════════════════════════════════
  // CHEMISTRY
  // ══════════════════════════════════════════
  {
    id: "chem-1", subject: "Chemistry", grade: "Secondary 1",
    title: "Secondary Chemistry 1",
    description: "Atomic structure, periodic table, and chemical bonding.",
    available: false, url: null,
  },
  {
    id: "chem-2", subject: "Chemistry", grade: "Secondary 2",
    title: "Secondary Chemistry 2",
    description: "Organic chemistry, reactions, and stoichiometry.",
    available: true,
    url: "https://www.scribd.com/document/718237729/Secpndary-Chemistry-2-Student-Textbook",
  },
  {
    id: "chem-3", subject: "Chemistry", grade: "Secondary 3",
    title: "Secondary Chemistry 3 (Teacher's Guide)",
    description: "Electrochemistry, acids, bases, and salts — Secondary 3.",
    available: true,
    url: "https://www.scribd.com/document/767726319/OK-chemistry-S3-TG-Cover",
  },
  {
    id: "chem-4", subject: "Chemistry", grade: "Secondary 4",
    title: "Secondary Chemistry 4",
    description: "Industrial chemistry, polymers, and advanced reactions.",
    available: true,
    url: "https://www.scribd.com/document/706288699/Secpndary-Chemistry-4-Student-Textbook",
  },

  // ══════════════════════════════════════════
  // PHYSICS
  // ══════════════════════════════════════════
  {
    id: "phy-1", subject: "Physics", grade: "Secondary 1",
    title: "Secondary Physics 1",
    description: "Mechanics, waves, and basic electricity.",
    available: true,
    url: "https://www.scribd.com/document/706288858/Secondary-Physics-1-Student-Textbook",
  },
  {
    id: "phy-2", subject: "Physics", grade: "Secondary 2",
    title: "Secondary Physics 2",
    description: "Electromagnetism, optics, and thermodynamics.",
    available: false, url: null,
  },
  {
    id: "phy-3", subject: "Physics", grade: "Secondary 3",
    title: "Secondary Physics 3",
    description: "Nuclear physics, radioactivity, and modern physics.",
    available: false, url: null,
  },
  {
    id: "phy-4", subject: "Physics", grade: "Secondary 4",
    title: "Secondary Physics 4",
    description: "Advanced mechanics, electronics, and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // HISTORY
  // ══════════════════════════════════════════
  {
    id: "hist-1", subject: "History", grade: "Secondary 1",
    title: "Secondary History 1",
    description: "Pre-colonial Africa and early civilizations.",
    available: false, url: null,
  },
  {
    id: "hist-2", subject: "History", grade: "Secondary 2",
    title: "Secondary History 2",
    description: "Colonial era, independence movements, and modern Africa.",
    available: true,
    url: "https://www.scribd.com/document/768555691/Secondary-History-2-Student-Textbook",
  },
  {
    id: "hist-3", subject: "History", grade: "Secondary 3",
    title: "Secondary History 3",
    description: "Contemporary world history and South Sudan's story.",
    available: true,
    url: "https://www.scribd.com/document/714974452/Secondary-History-3-Student-Textbook",
  },
  {
    id: "hist-4", subject: "History", grade: "Secondary 4",
    title: "Secondary History 4",
    description: "Advanced history and exam preparation for Secondary 4.",
    available: true,
    url: "https://www.scribd.com/document/773399720/Secondary-History-4-Student-Textbook",
  },

  // ══════════════════════════════════════════
  // GEOGRAPHY
  // ══════════════════════════════════════════
  {
    id: "geo-1", subject: "Geography", grade: "Secondary 1",
    title: "Secondary Geography 1",
    description: "Physical geography, maps, and climate.",
    available: true,
    url: "https://www.scribd.com/document/736235964/Secondary-Geography-1-Student-Textbook",
  },
  {
    id: "geo-2", subject: "Geography", grade: "Secondary 2",
    title: "Secondary Geography 2",
    description: "Human geography, population, and resources.",
    available: false, url: null,
  },
  {
    id: "geo-3", subject: "Geography", grade: "Secondary 3",
    title: "Secondary Geography 3",
    description: "Transport, communication, trade, and development.",
    available: true,
    url: "https://www.scribd.com/document/720263635/Secondary-Geography-3-Student-Textbook",
  },
  {
    id: "geo-4", subject: "Geography", grade: "Secondary 4",
    title: "Secondary Geography 4",
    description: "Advanced geography and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // CHRISTIAN RELIGIOUS EDUCATION (CRE)
  // ══════════════════════════════════════════
  {
    id: "cre-1", subject: "CRE", grade: "Secondary 1",
    title: "Secondary CRE 1",
    description: "Faith, values, and community — Secondary 1.",
    available: true,
    url: "https://www.scribd.com/document/781334560/Secondary-CRE-1-Student-Textbook",
  },
  {
    id: "cre-2", subject: "CRE", grade: "Secondary 2",
    title: "Secondary CRE 2",
    description: "The Church, ethics, and Christian living — Secondary 2.",
    available: false, url: null,
  },
  {
    id: "cre-3", subject: "CRE", grade: "Secondary 3",
    title: "Secondary CRE 3",
    description: "Prayer, worship, and Christian responsibility.",
    available: false, url: null,
  },
  {
    id: "cre-4", subject: "CRE", grade: "Secondary 4",
    title: "Secondary CRE 4",
    description: "Advanced CRE and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // CITIZENSHIP
  // ══════════════════════════════════════════
  {
    id: "cit-1", subject: "Citizenship", grade: "Secondary 1",
    title: "Secondary Citizenship 1",
    description: "Rights, responsibilities, and national identity.",
    available: false, url: null,
  },
  {
    id: "cit-2", subject: "Citizenship", grade: "Secondary 2",
    title: "Secondary Citizenship 2",
    description: "Governance, democracy, and civic participation.",
    available: true,
    url: "https://www.scribd.com/document/828623353/Secondary-Citizenship-2-Student-Textbook-1",
  },
  {
    id: "cit-3", subject: "Citizenship", grade: "Secondary 3",
    title: "Secondary Citizenship 3",
    description: "Community development and peace building.",
    available: false, url: null,
  },
  {
    id: "cit-4", subject: "Citizenship", grade: "Secondary 4",
    title: "Secondary Citizenship 4",
    description: "Advanced citizenship and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // ENGLISH
  // ══════════════════════════════════════════
  {
    id: "eng-1", subject: "English", grade: "Secondary 1",
    title: "Secondary English 1",
    description: "Grammar, comprehension, and composition basics.",
    available: false, url: null,
  },
  {
    id: "eng-2", subject: "English", grade: "Secondary 2",
    title: "Secondary English 2",
    description: "Literature, essay writing, and advanced grammar.",
    available: false, url: null,
  },
  {
    id: "eng-3", subject: "English", grade: "Secondary 3",
    title: "Secondary English 3",
    description: "Poetry, prose analysis, and oral communication.",
    available: false, url: null,
  },
  {
    id: "eng-4", subject: "English", grade: "Secondary 4",
    title: "Secondary English 4",
    description: "Advanced literature, critical writing, and exam skills.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // ECONOMICS
  // ══════════════════════════════════════════
  {
    id: "eco-1", subject: "Economics", grade: "Secondary 1",
    title: "Secondary Economics 1",
    description: "Basic economic concepts, demand, and supply.",
    available: false, url: null,
  },
  {
    id: "eco-2", subject: "Economics", grade: "Secondary 2",
    title: "Secondary Economics 2",
    description: "National income, money, and banking.",
    available: false, url: null,
  },
  {
    id: "eco-3", subject: "Economics", grade: "Secondary 3",
    title: "Secondary Economics 3",
    description: "International trade and development economics.",
    available: false, url: null,
  },
  {
    id: "eco-4", subject: "Economics", grade: "Secondary 4",
    title: "Secondary Economics 4",
    description: "Advanced economics and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // AGRICULTURE
  // ══════════════════════════════════════════
  {
    id: "agr-1", subject: "Agriculture", grade: "Secondary 1",
    title: "Secondary Agriculture 1",
    description: "Introduction to agriculture, soil science, and crop production.",
    available: false, url: null,
  },
  {
    id: "agr-2", subject: "Agriculture", grade: "Secondary 2",
    title: "Secondary Agriculture 2",
    description: "Animal husbandry, farm management, and agribusiness.",
    available: false, url: null,
  },
  {
    id: "agr-3", subject: "Agriculture", grade: "Secondary 3",
    title: "Secondary Agriculture 3",
    description: "Advanced crop science and agricultural economics.",
    available: false, url: null,
  },
  {
    id: "agr-4", subject: "Agriculture", grade: "Secondary 4",
    title: "Secondary Agriculture 4",
    description: "Agricultural technology and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // COMPUTER STUDIES
  // ══════════════════════════════════════════
  {
    id: "cs-1", subject: "Computer Studies", grade: "Secondary 1",
    title: "Secondary Computer Studies 1",
    description: "Introduction to computers, operating systems, and word processing.",
    available: false, url: null,
  },
  {
    id: "cs-2", subject: "Computer Studies", grade: "Secondary 2",
    title: "Secondary Computer Studies 2",
    description: "Spreadsheets, internet, and programming basics.",
    available: false, url: null,
  },
  {
    id: "cs-3", subject: "Computer Studies", grade: "Secondary 3",
    title: "Secondary Computer Studies 3",
    description: "Databases, networks, and software development.",
    available: false, url: null,
  },
  {
    id: "cs-4", subject: "Computer Studies", grade: "Secondary 4",
    title: "Secondary Computer Studies 4",
    description: "Advanced ICT and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // ACCOUNTING
  // ══════════════════════════════════════════
  {
    id: "acc-1", subject: "Accounting", grade: "Secondary 1",
    title: "Secondary Accounting 1",
    description: "Introduction to bookkeeping and double entry.",
    available: false, url: null,
  },
  {
    id: "acc-2", subject: "Accounting", grade: "Secondary 2",
    title: "Secondary Accounting 2",
    description: "Trial balance, financial statements, and cash flow.",
    available: false, url: null,
  },
  {
    id: "acc-3", subject: "Accounting", grade: "Secondary 3",
    title: "Secondary Accounting 3",
    description: "Business accounts and advanced bookkeeping.",
    available: false, url: null,
  },
  {
    id: "acc-4", subject: "Accounting", grade: "Secondary 4",
    title: "Secondary Accounting 4",
    description: "Advanced accounting and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // ENGLISH LITERATURE
  // ══════════════════════════════════════════
  {
    id: "lit-1", subject: "English Literature", grade: "Secondary 1",
    title: "Secondary English Literature 1",
    description: "Introduction to poetry, prose, and drama.",
    available: false, url: null,
  },
  {
    id: "lit-2", subject: "English Literature", grade: "Secondary 2",
    title: "Secondary English Literature 2",
    description: "African literature and critical analysis.",
    available: false, url: null,
  },
  {
    id: "lit-3", subject: "English Literature", grade: "Secondary 3",
    title: "Secondary English Literature 3",
    description: "Novel study, drama, and essay writing.",
    available: false, url: null,
  },
  {
    id: "lit-4", subject: "English Literature", grade: "Secondary 4",
    title: "Secondary English Literature 4",
    description: "Advanced literature and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // FINE ART
  // ══════════════════════════════════════════
  {
    id: "art-1", subject: "Fine Art", grade: "Secondary 1",
    title: "Secondary Fine Art 1",
    description: "Elements of art, drawing, and colour theory.",
    available: false, url: null,
  },
  {
    id: "art-2", subject: "Fine Art", grade: "Secondary 2",
    title: "Secondary Fine Art 2",
    description: "Painting techniques and African art.",
    available: false, url: null,
  },
  {
    id: "art-3", subject: "Fine Art", grade: "Secondary 3",
    title: "Secondary Fine Art 3",
    description: "Design, craft, and art history.",
    available: false, url: null,
  },
  {
    id: "art-4", subject: "Fine Art", grade: "Secondary 4",
    title: "Secondary Fine Art 4",
    description: "Advanced art and exam preparation.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // ADDITIONAL MATHEMATICS
  // ══════════════════════════════════════════
  {
    id: "addmath-3", subject: "Additional Mathematics", grade: "Secondary 3",
    title: "Secondary Additional Mathematics 3",
    description: "Vectors, matrices, differentiation, and integration.",
    available: false, url: null,
  },
  {
    id: "addmath-4", subject: "Additional Mathematics", grade: "Secondary 4",
    title: "Secondary Additional Mathematics 4",
    description: "Complex numbers, differential equations, and exam prep.",
    available: false, url: null,
  },

  // ══════════════════════════════════════════
  // GENERAL / CURRICULUM OVERVIEW
  // ══════════════════════════════════════════
  {
    id: "overview", subject: "General", grade: "All Levels",
    title: "South Sudan Subject Overviews (P1 – S4)",
    description: "Official overview of all subjects from Primary 1 to Secondary 4 by the Ministry of Education.",
    available: true,
    url: "https://www.scribd.com/document/643349012/SS-Subject-Overviews-1-pdf",
  },
];

export default textbooks;
