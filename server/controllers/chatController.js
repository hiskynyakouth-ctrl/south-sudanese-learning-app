exports.chat = (req, res) => {
  const { message } = req.body;
  // Integrate with AI service
  const response = `AI response to: ${message}`;
  res.json({ response });
};