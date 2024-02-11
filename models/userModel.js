// app/models/userModel.js
const db = require('../config/db');

const userModel = {
  getUser: (username, password, callback) => {
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], callback);
  },

  checkDuplicateUsername: (username, callback) => {
    const checkUsernameQuery = 'SELECT username FROM users WHERE username = ?';
    db.query(checkUsernameQuery, [username], (checkErr, checkResults) => {
      if (checkErr) {
        return callback(checkErr);
      }

      if (checkResults.length > 0) {
        // Username already exists, return an error
        return callback('Username already exists');
      }

      callback(null); // Username is available
    });
  }
};

module.exports = userModel;