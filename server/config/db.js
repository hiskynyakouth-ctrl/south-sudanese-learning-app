const { Pool } = require('pg');
require('dotenv').config();

// Railway/Render provide DATABASE_URL; local uses individual vars
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host:     process.env.DB_HOST     || 'localhost',
      user:     process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'south sudan e-learning',
      port:     parseInt(process.env.DB_PORT || '5432'),
    });

// Test connection asynchronously without blocking startup
pool.query('SELECT NOW()', (err, result) => {
  if (err) { 
    console.error('PostgreSQL connection failed:', err.message); 
  } else {
    console.log('Connected to PostgreSQL database:', process.env.DB_NAME || process.env.DATABASE_URL?.split('/').pop());
  }
});

function ph(sql) {
  let i = 0;
  return sql.replace(/[?]/g, function() { i++; return '$' + i; });
}

const db = {
  query: function(sql, params, cb) {
    if (typeof params === 'function') { cb = params; params = []; }
    pool.query(ph(sql), params, function(err, result) {
      if (err) return cb(err, null);
      cb(null, result.rows);
    });
  },
  pool: pool,
};

module.exports = db;
module.exports.pool = pool;
module.exports.db = db;
