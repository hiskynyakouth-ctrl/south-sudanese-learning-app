const Subject = require('../models/subjectModel');

exports.getSubjects = async (req, res) => {
  try {
    const { grade_id, stream_id } = req.query;
    const filter = {};

    if (grade_id) {
      const gradeNumber = Number(grade_id);
      filter.$or = [
        { gradeId: gradeNumber },
        { classId: gradeNumber },
      ];
    }

    if (typeof stream_id !== 'undefined') {
      filter.streamId = stream_id ? Number(stream_id) : null;
    }

    const subjects = await Subject.find(filter).sort({ gradeId: 1, classId: 1, name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found.' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};