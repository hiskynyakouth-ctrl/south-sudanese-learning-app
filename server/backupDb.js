// South Sudan E-Learning — Database Backup via Node.js
// Run: node server/backupDb.js
// Output: database/backup_data.json

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'south sudan e-learning',
  port:     parseInt(process.env.DB_PORT || '5432'),
});

const TABLES = [
  'users', 'grades', 'streams', 'subjects', 'topics',
  'chapters', 'quizzes', 'past_papers', 'textbooks', 'user_progress'
];

async function backup() {
  const backup = { timestamp: new Date().toISOString(), tables: {} };
  for (const table of TABLES) {
    try {
      const result = await pool.query(`SELECT * FROM ${table}`);
      backup.tables[table] = result.rows;
      console.log(`✅ ${table}: ${result.rows.length} rows`);
    } catch (err) {
      console.log(`⚠️  ${table}: ${err.message}`);
      backup.tables[table] = [];
    }
  }
  const outPath = path.join(__dirname, '../database/backup_data.json');
  fs.writeFileSync(outPath, JSON.stringify(backup, null, 2));
  console.log(`\n✅ Backup saved to database/backup_data.json`);
  pool.end();
}

backup().catch(console.error);
