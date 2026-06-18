const express = require("express");
const bcrypt  = require("bcryptjs");
const { register, login, me, googleAuth, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { query, getDbStatus } = require("../config/db");

const router = express.Router();

const requireDb = (res) => {
  if (getDbStatus().state === 1) return true;
  res.status(503).json({ error: "Database is not connected. Check DATABASE_URL on the backend server." });
  return false;
};

router.post("/register",       register);
router.post("/login",          login);
router.post("/google",         googleAuth);
router.get("/me", authMiddleware, me);
router.post("/reset-password", resetPassword);

// ── Update profile name ───────────────────────────────────
router.put("/profile", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Name is required." });
  if (!requireDb(res)) return;
  try {
    const result = await query(
      "UPDATE users SET name=$1 WHERE id=$2 RETURNING id,name,email,role",
      [name.trim(), req.user.id]);
    if (!result.rows.length) return res.status(404).json({ error: "User not found." });
    const u = result.rows[0];
    res.json({ message: "Profile updated.", user: { id: u.id, name: u.name, email: u.email, role: u.role } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Change password ───────────────────────────────────────
router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both passwords required." });
  if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters." });
  if (!requireDb(res)) return;
  try {
    const result = await query("SELECT password FROM users WHERE id=$1", [req.user.id]);
    if (!result.rows.length) return res.status(404).json({ error: "User not found." });
    const ok = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!ok) return res.status(401).json({ error: "Current password is incorrect." });
    const hash = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password=$1 WHERE id=$2", [hash, req.user.id]);
    res.json({ message: "Password changed successfully." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Create / update admin account ────────────────────────
router.post("/setup-admin", async (req, res) => {
  const { secret, email, password } = req.body;
  if (secret !== "ss_setup_2024_hisky") return res.status(403).json({ error: "Forbidden" });
  if (!requireDb(res)) return;
  try {
    const hash = await bcrypt.hash(password || "Admin@2024", 10);
    const normalizedEmail = (email || "admin@school.com").toLowerCase();
    const existing = await query("SELECT id FROM users WHERE email=$1", [normalizedEmail]);
    if (existing.rows.length) {
      await query("UPDATE users SET role='admin',password=$1 WHERE email=$2", [hash, normalizedEmail]);
      return res.json({ message: "Admin updated", user: { email: normalizedEmail, role: "admin" } });
    }
    const result = await query(
      "INSERT INTO users (name,email,password,role) VALUES ('Admin',$1,$2,'admin') RETURNING id,email,role",
      [normalizedEmail, hash]);
    res.json({ message: "Admin created", user: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Subscription ──────────────────────────────────────────
router.post("/subscribe", async (req, res) => {
  const { email, plan, txRef } = req.body;
  if (!email) return res.status(400).json({ error: "Email required." });
  if (!requireDb(res)) return;
  try {
    const expiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const result = await query(
      "UPDATE users SET subscription_plan=$1,subscription_expiry=$2 WHERE email=$3 RETURNING id",
      [plan, expiry, email.toLowerCase()]);
    if (!result.rows.length) return res.status(404).json({ error: "No account found with this email." });
    console.log(`✅ Subscription: ${email} | ${plan} | ${txRef}`);
    res.json({ message: "Subscription activated.", expiry });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Send email verification code ──────────────────────────
router.post("/send-email", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code required." });
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || gmailUser === "your@gmail.com")
    return res.status(503).json({ error: "Email not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD." });
  try {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail", auth: { user: gmailUser, pass: gmailPass }, tls: { rejectUnauthorized: false },
    });
    await transporter.sendMail({
      from: `"South Sudan E-Learning" <${gmailUser}>`,
      to: email,
      subject: "Your Password Reset Code - South Sudan E-Learning",
      html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
        <div style="background:linear-gradient(135deg,#0f6b5b,#1b3558);padding:20px;border-radius:10px;text-align:center;margin-bottom:20px">
          <h2 style="color:white;margin:0">South Sudan E-Learning</h2></div>
        <p>Your verification code:</p>
        <div style="background:#0f6b5b;color:white;font-size:36px;font-weight:bold;letter-spacing:10px;text-align:center;padding:24px;border-radius:10px;margin:16px 0">${code}</div>
        <p style="color:#666;font-size:14px">Valid for <strong>10 minutes</strong>.</p>
      </div>`,
    });
    res.json({ message: "Email sent.", method: "gmail" });
  } catch (err) { res.status(500).json({ error: "Failed to send email: " + err.message }); }
});

// ── Send SMS verification code ────────────────────────────
router.post("/send-sms", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Phone and code required." });
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone  = process.env.TWILIO_PHONE;
  if (accountSid && accountSid !== "ACxxxxxxxxxxxxxxx") {
    try {
      const twilio = require("twilio")(accountSid, authToken);
      await twilio.messages.create({ body: `SS E-Learning code: ${code} (valid 10 min)`, from: fromPhone, to: phone });
      return res.json({ message: "SMS sent.", method: "twilio" });
    } catch (err) { console.error("Twilio error:", err.message); }
  }
  // TextBelt free fallback
  try {
    const https = require("https");
    const postData = new URLSearchParams({ phone, message: `SS E-Learning code: ${code} (valid 10 min)`, key: "textbelt" }).toString();
    const tbReq = https.request({ hostname:"textbelt.com", path:"/text", method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded","Content-Length":Buffer.byteLength(postData)} },
      (tbRes) => {
        let data = "";
        tbRes.on("data", c => data += c);
        tbRes.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.success) return res.json({ message: "SMS sent.", method: "textbelt" });
            if (parsed.quotaRemaining === 0) return res.status(503).json({ error: "Daily SMS limit. Use Email instead." });
            res.status(503).json({ error: "SMS failed: " + (parsed.error || "Unknown") });
          } catch { res.status(500).json({ error: "SMS parse error." }); }
        });
      });
    tbReq.on("error", () => res.status(500).json({ error: "SMS unreachable. Use Email instead." }));
    tbReq.write(postData); tbReq.end();
  } catch (err) { res.status(500).json({ error: "SMS failed: " + err.message }); }
});

module.exports = router;
