const fs = require('fs');

// Add reset-password to authController
let ctrl = fs.readFileSync('controllers/authController.js', 'utf8');
if (!ctrl.includes('reset-password') && !ctrl.includes('resetPassword')) {
  const resetCode = `
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ error: "Email and new password are required." });
  try {
    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash(newPassword, 10);
    const r = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING id",
      [hash, email.toLowerCase()]
    );
    if (r.rows.length === 0)
      return res.status(404).json({ error: "No account found with this email." });
    res.json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`;
  ctrl += resetCode;
  fs.writeFileSync('controllers/authController.js', ctrl, 'utf8');
  console.log('resetPassword added to authController');
} else {
  console.log('resetPassword already exists');
}

// Add route
let routes = fs.readFileSync('routes/authRoutes.js', 'utf8');
if (!routes.includes('reset-password')) {
  routes = routes.replace(
    'module.exports = router;',
    'router.post("/reset-password", require("../controllers/authController").resetPassword);\nmodule.exports = router;'
  );
  fs.writeFileSync('routes/authRoutes.js', routes, 'utf8');
  console.log('reset-password route added');
} else {
  console.log('reset-password route already exists');
}
