const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  classId:     { type: Number, required: true },
  gradeId:     { type: Number },
  streamId:    { type: Number, default: null },
  icon:        { type: String, default: '📘' },
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);