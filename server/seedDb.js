// Run: node server/seedDb.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'south sudan e-learning',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Grades
    await client.query(`INSERT INTO grades (name) VALUES ('Senior 1'),('Senior 2'),('Senior 3'),('Senior 4') ON CONFLICT DO NOTHING`);
    console.log('✅ Grades seeded');

    // Streams
    await client.query(`INSERT INTO streams (name) VALUES ('Natural Sciences'),('Social Sciences') ON CONFLICT DO NOTHING`);
    console.log('✅ Streams seeded');

    // S1 & S2 subjects
    const coreSubjects = ['English','Mathematics','Biology','Chemistry','Physics','Geography','History','Citizenship','Computer Studies','CRE','Fine Art','Accounting','English Literature','Agriculture','Economics'];
    for (const grade of [1, 2]) {
      for (const name of coreSubjects) {
        await client.query('INSERT INTO subjects (name, grade_id, stream_id) VALUES ($1, $2, NULL) ON CONFLICT DO NOTHING', [name, grade]);
      }
    }
    console.log('✅ S1 & S2 subjects seeded');

    // S3 & S4 Natural Sciences
    const natural = ['English','Mathematics','Physics','Chemistry','Biology','Agriculture','CRE','Additional Mathematics'];
    for (const grade of [3, 4]) {
      for (const name of natural) {
        await client.query('INSERT INTO subjects (name, grade_id, stream_id) VALUES ($1, $2, 1) ON CONFLICT DO NOTHING', [name, grade]);
      }
    }
    console.log('✅ S3 & S4 Natural Sciences seeded');

    // S3 & S4 Social Sciences
    const social = ['English','History','Geography','Economics','Mathematics','Fine Art','Accounting','English Literature','CRE'];
    for (const grade of [3, 4]) {
      for (const name of social) {
        await client.query('INSERT INTO subjects (name, grade_id, stream_id) VALUES ($1, $2, 2) ON CONFLICT DO NOTHING', [name, grade]);
      }
    }
    console.log('✅ S3 & S4 Social Sciences seeded');

    await client.query('COMMIT');
    console.log('\n✅ Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
