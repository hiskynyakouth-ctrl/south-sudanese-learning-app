const { Pool } = require('pg');
require('dotenv').config();

let pool;

try {
  if (process.env.DATABASE_URL) {
    // Render/Railway provide DATABASE_URL
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    console.log("Using DATABASE_URL for PostgreSQL");
  } else {
    // Local development
    pool = new Pool({
      host:     process.env.DB_HOST     || 'localhost',
      user:     process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'south sudan e-learning',
      port:     parseInt(process.env.DB_PORT || '5432'),
    });
    console.log("Using local PostgreSQL:", process.env.DB_NAME);
  }

  // Test connection
  pool.query('SELECT NOW()', (err) => {
    if (err) console.error('PostgreSQL connection failed:', err.message);
    else console.log('Connected to PostgreSQL ✅');
  });

} catch (err) {
  console.error('DB pool creation failed:', err.message);
  // Create a dummy pool that returns errors gracefully
  pool = {
    query: (sql, params, cb) => {
      const fn = typeof params === 'function' ? params : cb;
      if (fn) fn(new Error('Database not connected: ' + err.message), null);
      return Promise.reject(new Error('Database not connected'));
    },
    end: () => Promise.resolve(),
  };
}

module.exports = { pool };
module.exports.pool = pool;
