const express = require("express");
const bcrypt = require("bcryptjs");
const { register, login, me, googleAuth, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", authMiddleware, me);

router.post("/reset-password", resetPassword);

// ── Update profile name ───────────────────────────────────
router.put("/profile", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Name is required." });
  try {
    const user = await User.findById(req.user.id).select("name email role");
    if (!user) return res.status(404).json({ error: "User not found." });
    user.name = name.trim();
    await user.save();
    res.json({ message: "Profile updated.", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Change password ───────────────────────────────────────
router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both passwords required." });
  if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters." });
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: "Current password is incorrect." });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/setup-admin", async (req, res) => {
  const { secret, email, password } = req.body;
  if (secret !== "ss_setup_2024_hisky") return res.status(403).json({ error: "Forbidden" });
  try {
    const hash = await bcrypt.hash(password || "Admin@2024", 10);
    const normalizedEmail = (email || "admin@school.com").toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      user.role = "admin";
      user.password = hash;
      await user.save();
      return res.json({ message: "Admin updated", user: { id: user._id, email: user.email, role: user.role } });
    }

    user = await User.create({
      name: "Admin",
      email: normalizedEmail,
      password: hash,
      role: "admin",
    });

    res.json({ message: "Admin created", user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/subscribe", async (req, res) => {
  const { email, plan, txRef, amount, currency } = req.body;
  if (!email) return res.status(400).json({ error: "Email required." });
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "No account found with this email." });
    const expiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    user.subscription_expiry = expiry;
    user.subscription_plan = plan;
    await user.save();
    console.log(`✅ Subscription recorded: ${email} | ${plan} | ${txRef}`);
    res.json({ message: "Subscription activated.", expiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Send verification code via Email (Nodemailer/Gmail) ───
router.post("/send-email", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code required." });

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || gmailUser === "your@gmail.com") {
    return res.status(503).json({ error: "Email not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD to server/.env" });
  }

  if (!gmailPass || gmailPass === "xxxx xxxx xxxx xxxx") {
    return res.status(503).json({ error: "Gmail App Password not set. Go to myaccount.google.com/apppasswords and add it to server/.env as GMAIL_APP_PASSWORD" });
  }

  try {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: '"South Sudan E-Learning" <' + gmailUser + '>',
      to: email,
      subject: "Your Password Reset Code - South Sudan E-Learning",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:12px">
          <div style="background:linear-gradient(135deg,#0f6b5b,#1b3558);padding:20px;border-radius:10px;text-align:center;margin-bottom:20px">
            <h2 style="color:white;margin:0">South Sudan E-Learning</h2>
            <p style="color:rgba(255,255,255,0.8);margin:5px 0 0">Password Reset</p>
          </div>
          <p style="color:#333">Your verification code is:</p>
          <div style="background:#0f6b5b;color:white;font-size:36px;font-weight:bold;letter-spacing:10px;text-align:center;padding:24px;border-radius:10px;margin:16px 0">
            ${code}
          </div>
          <p style="color:#666;font-size:14px">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color:#999;font-size:12px;border-top:1px solid #eee;padding-top:12px;margin-top:16px">
            Do not share this code with anyone. South Sudan E-Learning will never ask for your code.
          </p>
        </div>
      `,
    });

    res.json({ message: "Email sent.", method: "gmail" });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ error: "Failed to send email: " + err.message });
  }
});

// ── Send verification code via SMS (TextBelt via backend) ─
router.post("/send-sms", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Phone and code required." });

  // Try Twilio first (if configured)
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone  = process.env.TWILIO_PHONE;

  if (accountSid && accountSid !== "ACxxxxxxxxxxxxxxx") {
    try {
      const twilio = require("twilio")(accountSid, authToken);
      await twilio.messages.create({
        body: "South Sudan E-Learning reset code: " + code + " (valid 10 min). Do not share.",
        from: fromPhone,
        to: phone,
      });
      return res.json({ message: "SMS sent via Twilio.", method: "twilio" });
    } catch (err) {
      console.error("Twilio error:", err.message);
      // fall through to TextBelt
    }
  }

  // Fallback: TextBelt free tier (1 SMS/day per IP — works without signup)
  try {
    const https = require("https");
    const message = "South Sudan E-Learning reset code: " + code + " (valid 10 min). Do not share.";
    const params = new URLSearchParams({ phone, message, key: "textbelt" });
    const postData = params.toString();

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
          console.log("TextBelt response:", parsed);
          if (parsed.success) {
            return res.json({ message: "SMS sent.", method: "textbelt" });
          }
          // TextBelt quota exceeded — tell user to use email instead
          if (parsed.error === "LIMIT_EXCEEDED" || parsed.quotaRemaining === 0) {
            return res.status(503).json({
              error: "Daily SMS limit reached. Please use Email verification instead, or try again tomorrow.",
            });
          }
          res.status(503).json({ error: "SMS failed: " + (parsed.error || "Unknown error from TextBelt") });
        } catch {
          res.status(500).json({ error: "SMS response parse error." });
        }
      });
    });

    tbReq.on("error", (e) => {
      console.error("TextBelt request error:", e.message);
      res.status(500).json({ error: "Could not reach SMS service. Please use Email verification instead." });
    });
    tbReq.write(postData);
    tbReq.end();
  } catch (err) {
    res.status(500).json({ error: "SMS failed: " + err.message });
  }
});

module.exports = router;
