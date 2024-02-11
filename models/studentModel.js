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
  }
  
};

module.exports = studentModel;