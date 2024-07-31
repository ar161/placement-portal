// app/models/tpoModel.js
const db = require('../config/db');
const userModel = require('./userModel');

const tpoModel = {
  createPlacementOfficer: (username, name, email, contactNo, callback) => {
    const defaultPassword = 'password';

    // Check for duplicate username
    userModel.checkDuplicateUsername(username, (duplicateErr) => {
      if (duplicateErr) {
        return callback(duplicateErr); // Username already exists
      }

      // If username is available, proceed with creating the placement officer
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

          callback(null, placementResults);
        });
      });
    });
  },

  getAllTPOs: (callback) => {
    const query = 'SELECT * FROM placement_officers';
    db.query(query, callback);
  },

  getTotalTPOs : async () => {
    try {
      const [result] = await db.promise().execute('SELECT COUNT(*) AS count FROM placement_officers');
      return result[0].count;
    } catch (error) {
      throw new Error('Error fetching total TPOs');
    }
  }

};

module.exports = tpoModel;