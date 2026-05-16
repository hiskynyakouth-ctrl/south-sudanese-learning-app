// Update admin role in Render DB
const { Pool } = require("pg");
require("dotenv").config();

// Use the Render DATABASE_URL directly
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("Set DATABASE_URL env var"); process.exit(1); }

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  const r = await pool.query("UPDATE users SET role='admin' WHERE email='admin@school.com' RETURNING id, email, role");
  console.log("Updated:", r.rows[0]);
  await pool.end();
}
run().catch(e => { console.error(e.message); process.exit(1); });
