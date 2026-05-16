const https = require("https");
const body = JSON.stringify({ email: "admin@school.com", password: "Admin@2024" });
const req = https.request({
  hostname: "south-sudanese-learning-app-sqdw.onrender.com",
  path: "/api/auth/login", method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  rejectUnauthorized: false
}, res => {
  let d = ""; res.on("data", c => d += c);
  res.on("end", () => { console.log("Status:", res.statusCode); console.log(JSON.parse(d)); });
});
req.on("error", e => console.error(e.message));
req.write(body); req.end();
