const express = require("express");
const bcrypt = require("bcryptjs");
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
router.get("/me",  authMiddleware, me);
router.post("/reset-password", resetPassword);

// ── Update profile name ───────────────────────────────────
router.put("/profile", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Name is required." });
  if (!requireDb(res)) return;
  try {
    const result = await query(
      "UPDATE users SET name=$1 WHERE id=$2 RETURNING id, name, email, role",
      [name.trim(), req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "User not found." });
    const u = result.rows[0];
    res.json({ message: "Profile updated.", user: { id: u.id, name: u.name, email: u.email, role: u.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
      await query("UPDATE users SET role='admin', password=$1 WHERE email=$2", [hash, normalizedEmail]);
      return res.json({ message: "Admin updated", user: { email: normalizedEmail, role: "admin" } });
    }

    const result = await query(
      "INSERT INTO users (name, email, password, role) VALUES ('Admin',$1,$2,'admin') RETURNING id, email, role",
      [normalizedEmail, hash]
    );
    res.json({ message: "Admin created", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Subscription ──────────────────────────────────────────
router.post("/subscribe", async (req, res) => {
  const { email, plan, txRef } = req.body;
  if (!email) return res.status(400).json({ error: "Email required." });
  if (!requireDb(res)) return;
  try {
    const expiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const result = await query(
      "UPDATE users SET subscription_plan=$1, subscription_expiry=$2 WHERE email=$3 RETURNING id",
      [plan, expiry, email.toLowerCase()]
    );
    if (!result.rows.length) return res.status(404).json({ error: "No account found with this email." });
    console.log(`✅ Subscription: ${email} | ${plan} | ${txRef}`);
    res.json({ message: "Subscription activated.", expiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Send email verification code ──────────────────────────
router.post("/send-email", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code required." });

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  const usingGmail = gmailUser && gmailPass && gmailUser !== "your@gmail.com";
  const usingSmtp = smtpHost && smtpPort && smtpUser && smtpPass;

  if (!usingGmail && !usingSmtp) {
    return res.status(503).json({
      error: "Email not configured. Add GMAIL_USER/GMAIL_APP_PASSWORD or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD to server/.env",
    });
  }

  try {
    const nodemailer = require("nodemailer");
    const transportOptions = usingGmail
      ? {
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass },
          tls: { rejectUnauthorized: false },
        }
      : {
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: smtpPort === "465",
          auth: { user: smtpUser, pass: smtpPass },
        };
    const transporter = nodemailer.createTransport(transportOptions);
    await transporter.sendMail({
      from: `"South Sudan E-Learning" <${usingGmail ? gmailUser : smtpUser}>`,
      to: email,
      subject: "Your Password Reset Code - South Sudan E-Learning",
      html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:12px">
        <div style="background:linear-gradient(135deg,#0f6b5b,#1b3558);padding:20px;border-radius:10px;text-align:center;margin-bottom:20px">
          <h2 style="color:white;margin:0">South Sudan E-Learning</h2>
          <p style="color:rgba(255,255,255,0.8);margin:5px 0 0">Password Reset</p>
        </div>
        <p style="color:#333">Your verification code is:</p>
        <div style="background:#0f6b5b;color:white;font-size:36px;font-weight:bold;letter-spacing:10px;text-align:center;padding:24px;border-radius:10px;margin:16px 0">${code}</div>
        <p style="color:#666;font-size:14px">This code expires in <strong>10 minutes</strong>.</p>
      </div>`,
    });
    res.json({ message: "Email sent.", method: usingGmail ? "gmail" : "smtp" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email: " + err.message });
  }
});

// ── Send SMS verification code ────────────────────────────
router.post("/send-sms", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Phone and code required." });

  const accountSid    = process.env.TWILIO_ACCOUNT_SID;
  const authToken     = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone     = process.env.TWILIO_PHONE;
  const textbeltKey   = process.env.TEXTBELT_KEY || process.env.TEXTBELT_API_KEY || "textbelt";

  if (accountSid && authToken && fromPhone && accountSid !== "ACxxxxxxxxxxxxxxx") {
    try {
      const twilio = require("twilio")(accountSid, authToken);
      await twilio.messages.create({
        body: "South Sudan E-Learning reset code: " + code + " (valid 10 min). Do not share this code.",
        from: fromPhone,
        to: phone,
      });
      return res.json({ message: "SMS sent via Twilio.", method: "twilio" });
    } catch (err) {
      console.error("Twilio error:", err.message);
    }
  }

  // TextBelt fallback (paid API key recommended for reliable delivery)
  try {
    const https = require("https");
    const message = "South Sudan E-Learning reset code: " + code + " (valid 10 min). Do not share this code.";
    const postData = new URLSearchParams({ phone, message, key: textbeltKey }).toString();

    const options = {
      hostname: "textbelt.com",
      path: "/text",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const tbReq = https.request(options, (tbRes) => {
      let data = "";
      tbRes.on("data", (chunk) => data += chunk);
      tbRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success) {
            return res.json({ message: "SMS sent.", method: textbeltKey === "textbelt" ? "textbelt-free" : "textbelt" });
          }

          if (parsed.quotaRemaining === 0) {
            return res.status(503).json({ error: "Daily SMS limit reached. Use Email verification instead." });
          }

          const errMsg = parsed.error || "SMS delivery failed.";
          const extra = textbeltKey === "textbelt" ? " Free TextBelt support is limited; sign up for a paid TextBelt key or configure Twilio." : "";
          return res.status(503).json({ error: "TextBelt error: " + errMsg + extra });
        } catch (parseErr) {
          console.error("TextBelt parse error:", parseErr.message, data);
          res.status(500).json({ error: "SMS failed: invalid TextBelt response." });
        }
      });
    });

    tbReq.on("error", (error) => {
      console.error("TextBelt request error:", error.message);
      res.status(500).json({ error: "SMS service unreachable. Use Email instead." });
    });

    tbReq.write(postData);
    tbReq.end();
  } catch (err) {
    res.status(500).json({ error: "SMS failed: " + err.message });
  }
});

module.exports = router;
