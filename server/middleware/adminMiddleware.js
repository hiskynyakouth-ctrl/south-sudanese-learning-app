const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ss_elearning_secret");
    if (decoded.role !== "admin") return res.status(403).json({ error: "Admin access required." });
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = adminMiddleware;
