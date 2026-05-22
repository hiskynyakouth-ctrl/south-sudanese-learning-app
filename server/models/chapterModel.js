const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, default: '' },
});

const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options:  [{ type: String }],
  answer:   { type: String, required: true },
});

const ChapterSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  content:    { type: String, default: '' },
  video_url:  { type: String, default: '' },
  subjectId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  questions:  [QuestionSchema],
  quiz:       [QuizSchema],
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);