// Run this once to seed admin into the Render database
const https = require("https");

const body = JSON.stringify({
  name: "Admin",
  email: "admin@school.com",
  password: "Admin@2024"
});

const req = https.request({
  hostname: "south-sudanese-learning-app-sqdw.onrender.com",
  path: "/api/auth/register", method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  rejectUnauthorized: false
}, res => {
  let d = ""; res.on("data", c => d += c);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    const r = JSON.parse(d);
    console.log(r);
    if (res.statusCode === 201) console.log("✅ Admin registered! Now set role to admin in DB.");
    if (res.statusCode === 409) console.log("ℹ️  Admin already exists.");
  });
});
req.on("error", e => console.error(e.message));
req.write(body); req.end();
