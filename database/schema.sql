-- South Sudan E-Learning Platform
-- PostgreSQL Schema
-- Database name: "south sudan e-learning"
-- Run: psql -U postgres -d "south sudan e-learning" -f database/schema.sql

CREATE TABLE IF NOT EXISTS grades (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS streams (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  grade_id  INT REFERENCES grades(id),
  stream_id INT REFERENCES streams(id)
);

CREATE TABLE IF NOT EXISTS topics (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  subject_id INT REFERENCES subjects(id)
);

CREATE TABLE IF NOT EXISTS past_papers (
  id         SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subjects(id),
  year       INT NOT NULL,
  file_url   TEXT NOT NULL,
  title      VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chapters (
  id         SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subjects(id),
  title      VARCHAR(255) NOT NULL,
  content    TEXT,
  video_url  VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discussion_questions (
  id         SERIAL PRIMARY KEY,
  chapter_id INT REFERENCES chapters(id),
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quizzes (
  id         SERIAL PRIMARY KEY,
  chapter_id INT REFERENCES chapters(id),
  question   TEXT NOT NULL,
  options    JSONB,
  answer     VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS textbooks (
  id          SERIAL PRIMARY KEY,
  subject_id  INT REFERENCES subjects(id),
  title       VARCHAR(255) NOT NULL,
  grade       VARCHAR(50),
  pdf_url     VARCHAR(500) NOT NULL,
  cover_url   VARCHAR(500),
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id),
  chapter_id INT REFERENCES chapters(id),
  completed  BOOLEAN DEFAULT FALSE,
  score      INT
);
