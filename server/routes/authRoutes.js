const express = require("express");
const { register, login, me } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

router.post("/reset-password", require("../controllers/authController").resetPassword);

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

  // Try Twilio first
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
    }
  }

  // Fallback: TextBelt (1 free SMS/day, no CORS issue from backend)
  try {
    const https = require("https");
    const params = new URLSearchParams({ phone, message: "South Sudan E-Learning reset code: " + code + " (valid 10 min). Do not share.", key: "textbelt" });
    const postData = params.toString();

    const options = {
      hostname: "textbelt.com",
      path: "/text",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(postData) },
    };

    const tbReq = https.request(options, (tbRes) => {
      let data = "";
      tbRes.on("data", (chunk) => data += chunk);
      tbRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success) return res.json({ message: "SMS sent via TextBelt.", method: "textbelt" });
          res.status(503).json({ error: "TextBelt: " + (parsed.error || "Failed") });
        } catch { res.status(500).json({ error: "SMS parse error" }); }
      });
    });
    tbReq.on("error", (e) => res.status(500).json({ error: "SMS request failed: " + e.message }));
    tbReq.write(postData);
    tbReq.end();
  } catch (err) {
    res.status(500).json({ error: "SMS failed: " + err.message });
  }
});

module.exports = router;
