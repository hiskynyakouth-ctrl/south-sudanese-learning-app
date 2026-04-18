const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'south sudan e-learning',
  port:     parseInt(process.env.DB_PORT || '5432'),
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL connection failed:', err.message);
  } else {
    console.log('Connected to PostgreSQL database:', process.env.DB_NAME);
    release();
  }
});

// Wrap pool.query to match the mysql2 callback style used across the app
// Usage: db.query(sql, params, callback)
const db = {
  query: (sql, params, callback) => {
    // Support both db.query(sql, cb) and db.query(sql, params, cb)
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    // Convert MySQL ? placeholders to PostgreSQL $1, $2, ...
    let i = 0;
    const pgSql = sql.replace(/\?/g, () => `$${++i}`);

    pool.query(pgSql, params, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result.rows);
    });
  },
  pool,
};

module.exports = db;
