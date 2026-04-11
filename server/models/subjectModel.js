const db = require('../config/db');

class Subject {
  static findAll(callback) {
    db.query('SELECT * FROM subjects', callback);
  }

  static findById(id, callback) {
    db.query('SELECT * FROM subjects WHERE id = ?', [id], callback);
  }
}

module.exports = Subject;