const { Pool } = require('pg');

let pool = null;
let connected = false;

const getPool = () => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    } else {
      const config = {
        host:     process.env.DB_HOST     || 'localhost',
        user:     process.env.DB_USER     || 'postgres',
        database: process.env.DB_NAME     || 'elearning',
        port:     parseInt(process.env.DB_PORT || '5432'),
      };
      const password = process.env.DB_PASSWORD;
      if (password !== undefined && password !== '') {
        config.password = password;
      }
      pool = new Pool(config);
    }
  }
  return pool;
};

// Simple query helper
const query = (text, params) => getPool().query(text, params);

const connectDB = async () => {
  try {
    await query('SELECT 1');
    connected = true;
    console.log('✅ Connected to PostgreSQL');
    await initTables();
    return true;
  } catch (err) {
    connected = false;
    console.error('❌ PostgreSQL connection failed:', err.message);
    // Retry after 15s
    setTimeout(connectDB, 15000);
    return false;
  }
};

const getDbStatus = () => ({
  state: connected ? 1 : 0,
  status: connected ? 'connected' : 'disconnected',
});

// Auto-create tables on startup
const initTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id               SERIAL PRIMARY KEY,
      name             VARCHAR(255)        NOT NULL,
      email            VARCHAR(255) UNIQUE NOT NULL,
      password         VARCHAR(255)        NOT NULL,
      google_id        VARCHAR(255),
      picture          VARCHAR(500),
      role             VARCHAR(20)         DEFAULT 'student',
      subscription_plan    VARCHAR(50)     DEFAULT '',
      subscription_expiry  TIMESTAMPTZ,
      created_at       TIMESTAMPTZ         DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      description TEXT         DEFAULT '',
      grade_id    INT          NOT NULL DEFAULT 0,
      stream_id   INT,
      icon        VARCHAR(10)  DEFAULT '📘',
      created_at  TIMESTAMPTZ  DEFAULT NOW(),
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id          SERIAL PRIMARY KEY,
      subject_id  INT          REFERENCES subjects(id) ON DELETE CASCADE,
      title       VARCHAR(255) NOT NULL,
      content     TEXT         DEFAULT '',
      video_url   VARCHAR(500) DEFAULT '',
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS chapter_questions (
      id          SERIAL PRIMARY KEY,
      chapter_id  INT  REFERENCES chapters(id) ON DELETE CASCADE,
      question    TEXT NOT NULL,
      answer      TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id          SERIAL PRIMARY KEY,
      chapter_id  INT     REFERENCES chapters(id) ON DELETE CASCADE,
      question    TEXT    NOT NULL,
      options     JSONB   DEFAULT '[]',
      answer      VARCHAR(255) NOT NULL,
      correct_answer VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS past_papers (
      id          SERIAL PRIMARY KEY,
      subject_id  INT,
      subject     VARCHAR(150) DEFAULT '',
      grade       VARCHAR(50)  DEFAULT '',
      year        INT          NOT NULL,
      paper       VARCHAR(50)  DEFAULT '',
      title       VARCHAR(255) NOT NULL DEFAULT '',
      file_url    TEXT         DEFAULT '',
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    );
  `);
  console.log('✅ Tables ready');
};

module.exports = { query, connectDB, getDbStatus, getPool };
