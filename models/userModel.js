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
  }
};

module.exports = userModel;