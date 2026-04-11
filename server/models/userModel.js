const db = require('../config/db');

class User {
  static findByEmail(email, callback) {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  }

  static create(userData, callback) {
    db.query('INSERT INTO users SET ?', userData, callback);
  }
}

module.exports = User;