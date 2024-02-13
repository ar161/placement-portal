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

      callback(null, true); // Username is available
    });
  },

  getAllUsernames: () => {
    return new Promise((resolve, reject) => {
      const getAllUsernamesQuery = 'SELECT username FROM users';
      db.query(getAllUsernamesQuery, (err, results) => {
        if (err) {
          return reject(err);
        }
        const usernames = results.map(result => result.username);
        resolve(usernames);
      });
    });
  },

  checkDuplicateUsernames: async (usernamesToCheck) => {
    const allUsernames = await userModel.getAllUsernames();
    const duplicateUsernames = [];
    usernamesToCheck.forEach(username => {
      if (allUsernames.includes(username)) {
        duplicateUsernames.push(username);
      }
    });
    return duplicateUsernames;
  },

  getUserIDByUsername: (username, callback) => {
    const query = 'SELECT user_id FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (results.length === 0) {
            callback(null, null); // User not found
            return;
        }
        callback(null, results[0].user_id); // Return user_id
    });
  }
};

module.exports = userModel;