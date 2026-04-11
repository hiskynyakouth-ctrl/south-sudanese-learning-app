const db = require('../config/db');

class Chapter {
  static findBySubject(subjectId, callback) {
    db.query('SELECT * FROM chapters WHERE subject_id = ?', [subjectId], callback);
  }

  static findById(id, callback) {
    db.query('SELECT * FROM chapters WHERE id = ?', [id], callback);
  }
}

module.exports = Chapter;