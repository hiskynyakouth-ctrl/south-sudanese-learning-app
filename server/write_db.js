const fs = require('fs');
const content = `const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'south sudan e-learning',
  port:     parseInt(process.env.DB_PORT || '5432'),
});

pool.connect((err, client, release) => {
  if (err) { console.error('PostgreSQL connection failed:', err.message); }
  else { console.log('Connected to PostgreSQL database:', process.env.DB_NAME); release(); }
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
`;
fs.writeFileSync('config/db.js', content, 'utf8');
console.log('db.js written OK');
