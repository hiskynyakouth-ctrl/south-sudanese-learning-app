-- Sample data for South Sudanese eLearning App

INSERT INTO subjects (name, description) VALUES
('Mathematics', 'Basic mathematics concepts'),
('Science', 'Physics, Chemistry, and Biology'),
('English', 'English language learning');

INSERT INTO chapters (subject_id, title, content, video_url) VALUES
(1, 'Introduction to Algebra', 'Basic algebra concepts', 'videos/algebra.mp4'),
(1, 'Geometry Basics', 'Shapes and measurements', 'videos/geometry.mp4'),
(2, 'Physics Fundamentals', 'Laws of motion', 'videos/physics.mp4');

INSERT INTO quizzes (chapter_id, question, options, answer) VALUES
(1, 'What is 2 + 2?', '["3", "4", "5", "6"]', '4'),
(2, 'What is the area of a circle?', '["πr", "2πr", "πr²", "2πr²"]', 'πr²');