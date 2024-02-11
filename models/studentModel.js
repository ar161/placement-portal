// app/models/tpoModel.js
const db = require('../config/db');
const userModel = require('./userModel');

const studentModel = {
  createStudent: (username, name, email, callback) => {
    const defaultPassword = 'password';

    // Check for duplicate username
    userModel.checkDuplicateUsername(username, (duplicateErr) => {
      if (duplicateErr) {
        return callback(duplicateErr); // Username already exists
      }

      // If username is available, proceed with creating the student
      const userQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      db.query(userQuery, [username, defaultPassword, 'student'], (userErr, userResults) => {
        if (userErr) {
          return callback(userErr);
        }

        // Insert into students table
        const studentInsertQuery = 'INSERT INTO students (user_id, username, name, email) VALUES (?, ?, ?, ?)';
        db.query(studentInsertQuery, [userResults.insertId, username, name, email], (studentInsertErr, studentInsertResults) => {
          if (studentInsertErr) {
            return callback(studentInsertErr);
          }

          callback(null, studentInsertResults);
        });
      });
    });
  }
  
};

module.exports = studentModel;