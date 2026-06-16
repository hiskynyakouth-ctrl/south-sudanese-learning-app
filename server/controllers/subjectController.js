const Subject = require('../models/subjectModel');

exports.getSubjects = async (req, res) => {
  try {
    const { grade_id, stream_id } = req.query;
    const filter = {};

    if (grade_id) {
      filter.gradeId = Number(grade_id);
    }
    if (typeof stream_id !== 'undefined') {
      if (stream_id === '' || stream_id === 'null') {
        filter.streamId = null;
      } else {
        filter.streamId = Number(stream_id);
      }
    }

    const subjects = await Subject.find(filter).sort({ gradeId: 1, name: 1 });
    
    // Map _id to id for frontend compatibility
    res.json(subjects.map(sub => ({
      id: sub._id,
      name: sub.name,
      description: sub.description,
      grade_id: sub.gradeId,
      stream_id: sub.streamId,
      icon: sub.icon,
      created_at: sub.createdAt,
      updated_at: sub.updatedAt
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found.' });
    
    res.json({
      id: subject._id,
      name: subject.name,
      description: subject.description,
      grade_id: subject.gradeId,
      stream_id: subject.streamId,
      icon: subject.icon,
      created_at: subject.createdAt,
      updated_at: subject.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
