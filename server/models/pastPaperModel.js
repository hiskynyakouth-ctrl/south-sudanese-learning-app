const mongoose = require('mongoose');

const PastPaperSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
  subject:   { type: String, default: '' },
  grade:     { type: String, default: '' },
  year:      { type: Number, required: true },
  paper:     { type: String, default: '' },
  title:     { type: String, required: true },
  file_url:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('PastPaper', PastPaperSchema);
