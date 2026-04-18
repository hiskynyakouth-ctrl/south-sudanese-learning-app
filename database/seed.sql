-- South Sudan E-Learning — Seed Data (PostgreSQL)
-- Run AFTER schema.sql:
-- psql -U postgres -d "south sudan e-learning" -f database/seed.sql

-- ── GRADES ──────────────────────────────────────────────
INSERT INTO grades (name) VALUES
  ('Senior 1'), ('Senior 2'), ('Senior 3'), ('Senior 4')
ON CONFLICT DO NOTHING;

-- ── STREAMS ─────────────────────────────────────────────
INSERT INTO streams (name) VALUES
  ('Natural Sciences'), ('Social Sciences')
ON CONFLICT DO NOTHING;

-- ── SUBJECTS S1 & S2 (no stream) ────────────────────────
INSERT INTO subjects (name, grade_id, stream_id) VALUES
  ('English',1,NULL),('Mathematics',1,NULL),('Biology',1,NULL),
  ('Chemistry',1,NULL),('Physics',1,NULL),('Geography',1,NULL),
  ('History',1,NULL),('Citizenship',1,NULL),('Computer Studies',1,NULL),
  ('CRE',1,NULL),('Fine Art',1,NULL),('Accounting',1,NULL),
  ('English Literature',1,NULL),('Agriculture',1,NULL),('Economics',1,NULL),
  ('English',2,NULL),('Mathematics',2,NULL),('Biology',2,NULL),
  ('Chemistry',2,NULL),('Physics',2,NULL),('Geography',2,NULL),
  ('History',2,NULL),('Citizenship',2,NULL),('Computer Studies',2,NULL),
  ('CRE',2,NULL),('Fine Art',2,NULL),('Accounting',2,NULL),
  ('English Literature',2,NULL),('Agriculture',2,NULL),('Economics',2,NULL);

-- ── SUBJECTS S3 & S4 — NATURAL SCIENCES (stream_id=1) ───
INSERT INTO subjects (name, grade_id, stream_id) VALUES
  ('English',3,1),('Mathematics',3,1),('Physics',3,1),
  ('Chemistry',3,1),('Biology',3,1),('Agriculture',3,1),
  ('CRE',3,1),('Additional Mathematics',3,1),
  ('English',4,1),('Mathematics',4,1),('Physics',4,1),
  ('Chemistry',4,1),('Biology',4,1),('Agriculture',4,1),
  ('CRE',4,1),('Additional Mathematics',4,1);

-- ── SUBJECTS S3 & S4 — SOCIAL SCIENCES (stream_id=2) ────
INSERT INTO subjects (name, grade_id, stream_id) VALUES
  ('English',3,2),('History',3,2),('Geography',3,2),
  ('Economics',3,2),('Mathematics',3,2),('Fine Art',3,2),
  ('Accounting',3,2),('English Literature',3,2),('CRE',3,2),
  ('English',4,2),('History',4,2),('Geography',4,2),
  ('Economics',4,2),('Mathematics',4,2),('Fine Art',4,2),
  ('Accounting',4,2),('English Literature',4,2),('CRE',4,2);

-- ── SAMPLE TOPICS ────────────────────────────────────────
INSERT INTO topics (name, subject_id) VALUES
  ('Cell Structure', 3),
  ('Force and Motion', 5),
  ('Algebra Basics', 2),
  ('Maps and Map Reading', 6),
  ('Reading Comprehension', 1),
  ('Essay Writing', 1),
  ('Atomic Structure', 4),
  ('Photosynthesis', 3),
  ('Newton Laws of Motion', 5),
  ('Demand and Supply', 15);

-- ── SAMPLE CHAPTERS ──────────────────────────────────────
INSERT INTO chapters (subject_id, title, content, video_url) VALUES
  (3, 'Introduction to Cell Biology',
   'The cell is the basic unit of life. All living things are made of cells.',
   'https://www.youtube.com/watch?v=URUJD5NEXC8'),
  (5, 'Newton Laws of Motion',
   'Newton three laws describe the relationship between force and motion.',
   'https://www.youtube.com/watch?v=b1t41Q3xRM8'),
  (2, 'Introduction to Algebra',
   'Algebra uses letters to represent unknown values in equations.',
   'https://www.youtube.com/watch?v=NybHckSEQBI');

-- ── SAMPLE PAST PAPERS ───────────────────────────────────
INSERT INTO past_papers (subject_id, year, file_url, title) VALUES
  (5, 2021, 'https://www.scribd.com/document/873915210/Physics-2021-Set-B-1-2', 'Physics 2021 Paper 1'),
  (3, 2021, 'https://www.scribd.com/document/783949328/BIO-1', 'Biology 2021 Paper 1'),
  (2, 2022, 'https://www.scribd.com/search?query=South+Sudan+Mathematics+past+paper+2022', 'Mathematics 2022 Paper 1'),
  (1, 2022, 'https://www.scribd.com/search?query=South+Sudan+English+past+paper+2022', 'English 2022 Paper 1'),
  (4, 2023, 'https://www.scribd.com/search?query=South+Sudan+Chemistry+past+paper+2023', 'Chemistry 2023 Paper 1'),
  (6, 2023, 'https://www.scribd.com/search?query=South+Sudan+Geography+past+paper+2023', 'Geography 2023 Paper 1'),
  (7, 2022, 'https://www.scribd.com/search?query=South+Sudan+History+past+paper+2022', 'History 2022 Paper 1'),
  (15, 2021, 'https://www.scribd.com/search?query=South+Sudan+Economics+past+paper+2021', 'Economics 2021 Paper 1');

-- ── SAMPLE QUIZ QUESTIONS ────────────────────────────────
INSERT INTO quizzes (chapter_id, question, options, answer) VALUES
  (1, 'What is the basic unit of life?',
   '["Atom", "Cell", "Tissue", "Organ"]', 'Cell'),
  (2, 'What is Newton Second Law?',
   '["F=mv", "F=ma", "F=mg", "F=mgh"]', 'F=ma'),
  (3, 'Solve: 2x + 4 = 10',
   '["x=7", "x=3", "x=5", "x=2"]', 'x=3');
