-- Sample data for South Sudanese eLearning App

INSERT INTO subjects (name, description) VALUES
('Mathematics', 'Core mathematics for South Sudan secondary students'),
('Science', 'Physics, Chemistry, and Biology foundations'),
('English', 'Language, grammar, and reading comprehension');

INSERT INTO chapters (subject_id, title, content, video_url) VALUES
(1, 'Introduction to Algebra', 'Basic algebra concepts with variables, expressions, and simple equations for Senior students.', 'https://www.youtube.com/watch?v=NybHckSEQBI'),
(1, 'Geometry Basics', 'Shapes, angles, and measurements used in school mathematics and daily life.', 'https://www.youtube.com/watch?v=302eJ3TzJQU'),
(2, 'Physics Fundamentals', 'An introduction to force, motion, energy, and scientific observation.', 'https://www.youtube.com/watch?v=b1t41Q3xRM8');

INSERT INTO discussion_questions (chapter_id, question, answer) VALUES
(1, 'What is a variable in algebra?', 'A variable is a symbol, usually a letter, that stands for an unknown or changing value.'),
(1, 'Why do we learn algebra?', 'Algebra helps us solve unknown values, describe patterns, and build problem-solving skills.'),
(2, 'What is geometry used for?', 'Geometry helps us understand shapes, space, measurement, and design.'),
(3, 'What is force?', 'Force is a push or pull that can change the motion of an object.');

INSERT INTO quizzes (chapter_id, question, options, answer) VALUES
(1, 'What is 2 + 2?', '["3", "4", "5", "6"]', '4'),
(2, 'What is the area of a circle?', '["pr", "2pr", "pr^2", "2pr^2"]', 'pr^2'),
(3, 'Which unit is commonly used for force?', '["Newton", "Meter", "Litre", "Second"]', 'Newton');

-- Textbooks seed data
INSERT INTO textbooks (subject_id, title, grade, pdf_url, description) VALUES
(1, 'Mathematics Senior 1', 'Senior 1', 'https://www.africaeducation.org/uploads/maths_s1.pdf', 'Algebra, geometry, and arithmetic fundamentals for Senior 1 students.'),
(1, 'Mathematics Senior 2', 'Senior 2', 'https://www.africaeducation.org/uploads/maths_s2.pdf', 'Trigonometry, statistics, and advanced algebra for Senior 2 students.'),
(2, 'Science Senior 1', 'Senior 1', 'https://www.africaeducation.org/uploads/science_s1.pdf', 'Physics, chemistry, and biology foundations for Senior 1 students.'),
(2, 'Science Senior 2', 'Senior 2', 'https://www.africaeducation.org/uploads/science_s2.pdf', 'Advanced science topics for Senior 2 students.'),
(3, 'English Senior 1', 'Senior 1', 'https://www.africaeducation.org/uploads/english_s1.pdf', 'Grammar, comprehension, and composition for Senior 1 students.'),
(3, 'English Senior 2', 'Senior 2', 'https://www.africaeducation.org/uploads/english_s2.pdf', 'Literature, essay writing, and advanced grammar for Senior 2 students.');

-- ── GRADES ──────────────────────────────────────────────
INSERT INTO grades (name) VALUES ('Senior 1'),('Senior 2'),('Senior 3'),('Senior 4');

-- ── STREAMS ─────────────────────────────────────────────
INSERT INTO streams (name) VALUES ('Natural Sciences'),('Social Sciences');

-- ── SUBJECTS S1 & S2 (no stream) ────────────────────────
INSERT INTO subjects (name, grade_id, stream_id) VALUES
('English',1,NULL),('Mathematics',1,NULL),('Biology',1,NULL),
('Chemistry',1,NULL),('Physics',1,NULL),('Geography',1,NULL),
('History',1,NULL),('Citizenship',1,NULL),('Computer Studies',1,NULL),('CRE',1,NULL),
('English',2,NULL),('Mathematics',2,NULL),('Biology',2,NULL),
('Chemistry',2,NULL),('Physics',2,NULL),('Geography',2,NULL),
('History',2,NULL),('Computer Studies',2,NULL);

-- ── SUBJECTS S3 & S4 — NATURAL SCIENCES ─────────────────
INSERT INTO subjects (name, grade_id, stream_id) VALUES
('English',3,1),('Mathematics',3,1),('Physics',3,1),('Chemistry',3,1),('Biology',3,1),
('English',4,1),('Mathematics',4,1),('Physics',4,1),('Chemistry',4,1),('Biology',4,1);

-- ── SUBJECTS S3 & S4 — SOCIAL SCIENCES ──────────────────
INSERT INTO subjects (name, grade_id, stream_id) VALUES
('English',3,2),('History',3,2),('Geography',3,2),('Economics',3,2),('Mathematics',3,2),
('English',4,2),('History',4,2),('Geography',4,2),('Economics',4,2),('Mathematics',4,2);

-- ── SAMPLE TOPICS ────────────────────────────────────────
INSERT INTO topics (name, subject_id) VALUES
('Cell Structure',3),('Force and Motion',5),('Algebra Basics',2),('Maps and Map Reading',6),
('Reading Comprehension',1),('Essay Writing',1),('Atomic Structure',4),('Photosynthesis',3);

-- ── SAMPLE PAST PAPERS ───────────────────────────────────
INSERT INTO past_papers (subject_id, year, file_url, title) VALUES
(5, 2023, 'https://www.scribd.com/document/873915210/Physics-2021-Set-B-1-2', 'Physics 2023 Paper 1'),
(3, 2021, 'https://www.scribd.com/document/783949328/BIO-1', 'Biology 2021 Paper 1'),
(2, 2022, 'https://www.scribd.com/search?query=South+Sudan+Mathematics+past+paper+2022', 'Mathematics 2022 Paper 1'),
(1, 2022, 'https://www.scribd.com/search?query=South+Sudan+English+past+paper+2022', 'English 2022 Paper 1');
