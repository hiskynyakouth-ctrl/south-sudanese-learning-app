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
