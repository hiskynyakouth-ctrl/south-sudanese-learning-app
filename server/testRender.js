const https = require("https");

const body = JSON.stringify({ email: "admin@school.com", password: "Admin@2024" });

const req = https.request({
  hostname: "south-sudanese-learning-app-1.onrender.com",
  path: "/api/auth/login",
  method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  rejectUnauthorized: false
}, (res) => {
  let data = "";
  res.on("data", c => data += c);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    try { console.log("Body:", JSON.parse(data)); }
    catch { console.log("Raw:", data); }
  });
});

req.on("error", e => console.error("Error:", e.message));
req.write(body);
req.end();
