require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'south sudan e-learning',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function setup() {
  console.log('Creating tables...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS grades (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS streams (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS subjects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      grade_id INT,
      stream_id INT
    );
    CREATE TABLE IF NOT EXISTS topics (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      subject_id INT
    );
    CREATE TABLE IF NOT EXISTS past_papers (
      id SERIAL PRIMARY KEY,
      subject_id INT,
      year INT NOT NULL,
      file_url TEXT NOT NULL,
      title VARCHAR(255)
    );
    CREATE TABLE IF NOT EXISTS chapters (
      id SERIAL PRIMARY KEY,
      subject_id INT,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      video_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      chapter_id INT,
      question TEXT NOT NULL,
      options JSONB,
      answer VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS textbooks (
      id SERIAL PRIMARY KEY,
      subject_id INT,
      title VARCHAR(255) NOT NULL,
      grade VARCHAR(50),
      pdf_url VARCHAR(500) NOT NULL,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INT,
      chapter_id INT,
      completed BOOLEAN DEFAULT FALSE,
      score INT
    );
  `);
  console.log('All tables created successfully!');
  await pool.end();
}

setup().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
