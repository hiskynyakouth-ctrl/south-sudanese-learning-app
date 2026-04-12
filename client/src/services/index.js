const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/subjects", (req, res) => {
  res.json([
    "Math",
    "English",
    "Biology",
    "Chemistry"
  ]);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});