// app/models/userModel.js
const db = require('../config/db');

const userModel = {
  getUser: (username, password, callback) => {
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], callback);
  },

  createPlacementOfficer: (username, name, email, contactNo, callback) => {
    const defaultPassword = 'password';

    // Check if the username already exists
    const checkUsernameQuery = 'SELECT username FROM users WHERE username = ?';
    db.query(checkUsernameQuery, [username], (checkErr, checkResults) => {
      if (checkErr) {
        return callback(checkErr);
      }

      if (checkResults.length > 0) {
        // Username already exists, return an error
        return callback('Username already exists');
      }

      // Insert into users table
      const userQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      db.query(userQuery, [username, defaultPassword, 'officer'], (userErr, userResults) => {
        if (userErr) {
          return callback(userErr);
        }

        // Insert into placement_officers table
        const placementQuery = 'INSERT INTO placement_officers (user_id, username, name, email, contact_no) VALUES (?, ?, ?, ?, ?)';
        db.query(placementQuery, [userResults.insertId, username, name, email, contactNo], (placementErr, placementResults) => {
          if (placementErr) {
            return callback(placementErr);
          }

          return callback(null, placementResults);
        });
      });
    });
  }
};

module.exports = userModel;