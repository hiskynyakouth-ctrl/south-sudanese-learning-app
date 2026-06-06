// Textbooks are served from uploaded files via uploadRoutes.js
// This controller is a no-op placeholder kept for compatibility
exports.getTextbooks = (req, res) => res.json([]);
exports.getTextbook  = (req, res) => res.status(404).json({ error: 'Not found.' });
