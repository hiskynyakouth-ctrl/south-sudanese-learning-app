-- Database schema for South Sudanese eLearning App

CREATE DATABASE IF NOT EXISTS elearning;
USE elearning;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chapters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chapter_id INT,
  question TEXT NOT NULL,
  options JSON,
  answer VARCHAR(255) NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

CREATE TABLE user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  chapter_id INT,
  completed BOOLEAN DEFAULT FALSE,
  score INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);