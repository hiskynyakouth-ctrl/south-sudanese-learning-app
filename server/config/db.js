/**
 * PostgreSQL connection using the `pg` library.
 * Uses DATABASE_URL (Render/cloud) or individual DB_* vars (local).
 */
const { Pool } = require('pg');

let pool = null;
let connected = false;

const createPool = () => {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    return new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return new Pool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'elearning',
    port:     parseInt(process.env.DB_PORT || '5432'),
  });
};

const getPool = () => {
  if (!pool) pool = createPool();
  return pool;
};

// Parameterised query helper
const query = (text, params) => getPool().query(text, params);

// ── Auto-create tables ────────────────────────────────────
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
      id             SERIAL PRIMARY KEY,
      chapter_id     INT     REFERENCES chapters(id) ON DELETE CASCADE,
      question       TEXT    NOT NULL,
      options        JSONB   DEFAULT '[]',
      answer         VARCHAR(255) NOT NULL
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

    CREATE TABLE IF NOT EXISTS payment_requests (
      id          SERIAL PRIMARY KEY,
      user_id     INT          REFERENCES users(id) ON DELETE SET NULL,
      email       VARCHAR(255) NOT NULL,
      name        VARCHAR(255) DEFAULT '',
      plan        VARCHAR(100) DEFAULT '',
      amount      VARCHAR(50)  DEFAULT '',
      currency    VARCHAR(20)  DEFAULT '',
      method      VARCHAR(100) DEFAULT '',
      status      VARCHAR(20)  DEFAULT 'pending',
      notes       TEXT         DEFAULT '',
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    );
  `);
  console.log('✅ PostgreSQL tables ready');
};

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
    setTimeout(connectDB, 15000);
    return false;
  }
};

const getDbStatus = () => ({
  state:  connected ? 1 : 0,
  status: connected ? 'connected' : 'disconnected',
});

module.exports = { query, connectDB, getDbStatus, getPool };
