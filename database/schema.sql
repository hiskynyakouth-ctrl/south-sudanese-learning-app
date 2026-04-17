-- South Sudan E-Learning Platform — Full Database Schema
-- Compatible with PostgreSQL and MySQL

CREATE DATABASE IF NOT EXISTS elearning;
USE elearning;

-- Grades (Senior 1–4)
CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Streams (Natural Sciences / Social Sciences)
CREATE TABLE IF NOT EXISTS streams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Subjects (linked to grade and optionally a stream)
CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  grade_id INT,
  stream_id INT,
  FOREIGN KEY (grade_id) REFERENCES grades(id),
  FOREIGN KEY (stream_id) REFERENCES streams(id)
);

-- Topics per subject
CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  subject_id INT,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Past exam papers
CREATE TABLE IF NOT EXISTS past_papers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT,
  year INT NOT NULL,
  file_url TEXT NOT NULL,
  title VARCHAR(255),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','teacher','admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters
CREATE TABLE IF NOT EXISTS chapters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Discussion questions
CREATE TABLE IF NOT EXISTS discussion_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chapter_id INT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chapter_id INT,
  question TEXT NOT NULL,
  options JSON,
  answer VARCHAR(255) NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- Textbooks
CREATE TABLE IF NOT EXISTS textbooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT,
  title VARCHAR(255) NOT NULL,
  grade VARCHAR(50),
  pdf_url VARCHAR(500) NOT NULL,
  cover_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Student progress
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  chapter_id INT,
  completed BOOLEAN DEFAULT FALSE,
  score INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);
