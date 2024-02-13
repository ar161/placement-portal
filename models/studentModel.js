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
  },

  createStudentsFromFile: async (students) => {
    let successes = [];
    let errors = [];

    try {
      // Start transaction
      await db.promise().beginTransaction();

      for (const student of students) {
        const { Username, Name, Email } = student;
        const defaultPassword = 'password';

        // Insert user
        const userQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        const [userResult] = await db.promise().query(userQuery, [Username, defaultPassword, 'student']);
        const userId = userResult.insertId;

        // Insert student
        const studentInsertQuery = 'INSERT INTO students (user_id, username, name, email) VALUES (?, ?, ?, ?)';
        await db.promise().query(studentInsertQuery, [userId, Username, Name, Email]);

        successes.push(student);
      }

      // Commit transaction
      await db.promise().commit();

    } catch (error) {
      // Rollback transaction on error
      await db.promise().rollback();
      throw error;
    }

    if (successes.length === 0) {
      return { errors: 'Failed to add students' };
    }

    return { successes, errors };
  },

  getStudentIsMaster: (userId, callback) => {
    const query = 'SELECT is_master FROM students WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (results.length === 0) {
            callback(null, false); // Assuming false if user not found or is_master not set
            return;
        }
        callback(null, results[0].is_master === 1); // Assuming is_master is stored as 0 or 1
    });
  },

  getStudentDetails: (userId, callback) => {
    const query = 'SELECT name, username, email, batch, program, stream, cgpa, backlogs, tenth_percent, twelth_percent, is_master FROM students WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (results.length === 0) {
            callback(null, null); // Assuming null if user not found
            return;
        }
        callback(null, results[0]); // Assuming only one student record per user
    });
  },

  updateStudentDetails: (userId, details, callback) => {
    const query = 'UPDATE students SET batch=?, program=?, stream=?, cgpa=?, backlogs=?, tenth_percent=?, twelth_percent=?, is_master=? WHERE user_id=?';
    const values = [details.batch, details.program, details.stream, details.cgpa, details.backlogs, details.tenth_percent, details.twelth_percent, details.is_master ? 1 : 0, userId];
    db.query(query, values, callback);
  },

  isStudentUsername: (username, callback) => {
    const query = 'SELECT user_id FROM users WHERE username = ? AND role = "student"';
    db.query(query, [username], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (results.length === 0) {
            callback(null, false); // Username not found or not associated with a student
            return;
        }
        const userId = results[0].user_id;
        callback(null, userId);
    });
  }
};

module.exports = studentModel;