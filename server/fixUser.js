const bcrypt = require("bcryptjs");
const { pool } = require("./config/db");

async function run() {
  const email = "hiskynyakouth@gmail.com";
  const r = await pool.query("SELECT id, email, role FROM users WHERE LOWER(email)=LOWER($1)", [email]);
  
  if (r.rows.length === 0) {
    console.log("User not found. Creating...");
    const hash = await bcrypt.hash("Student@2024", 10);
    const ins = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, email",
      ["Hisky Nyakouth", email, hash, "student"]
    );
    console.log("Created:", ins.rows[0]);
  } else {
    console.log("Found:", r.rows[0]);
    const hash = await bcrypt.hash("Student@2024", 10);
    await pool.query("UPDATE users SET password=$1 WHERE LOWER(email)=LOWER($2)", [hash, email]);
    console.log("Password reset to: Student@2024");
  }
  await pool.end();
}
run().catch(e => { console.error(e.message); process.exit(1); });
