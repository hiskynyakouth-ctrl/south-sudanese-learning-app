exports.chat = (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Please enter a question for the AI tutor." });
  }

  const response =
    "Study helper summary: " +
    message.trim() +
    ". Break the topic into key ideas, define the hard words, and revise with one example from class.";

  return res.json({ response });
};
