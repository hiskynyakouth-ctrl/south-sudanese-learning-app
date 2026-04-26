const fs = require('fs');

// Add SMS route to authRoutes
let routes = fs.readFileSync('routes/authRoutes.js', 'utf8');
if (!routes.includes('send-sms')) {
  const smsRoute = `
router.post("/send-sms", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Phone and code required." });
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone  = process.env.TWILIO_PHONE;
  
  if (!accountSid || accountSid === "ACxxxxxxxxxxxxxxx") {
    return res.status(503).json({ error: "SMS not configured. Add Twilio credentials to server/.env" });
  }
  
  try {
    const twilio = require("twilio")(accountSid, authToken);
    await twilio.messages.create({
      body: "Your South Sudan E-Learning reset code: " + code + " (valid 10 min)",
      from: fromPhone,
      to: phone,
    });
    res.json({ message: "SMS sent." });
  } catch (err) {
    res.status(500).json({ error: "SMS failed: " + err.message });
  }
});
`;
  routes = routes.replace('module.exports = router;', smsRoute + '\nmodule.exports = router;');
  fs.writeFileSync('routes/authRoutes.js', routes, 'utf8');
  console.log('SMS route added');
} else {
  console.log('SMS route already exists');
}
