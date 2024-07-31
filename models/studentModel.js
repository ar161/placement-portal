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
    const query = 'SELECT name, username, email, batch, program_id, stream_id, cgpa, backlogs, tenth_percent, twelth_percent, is_master FROM students WHERE user_id = ?';
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
    const query = 'UPDATE students SET batch=?, program_id=?, stream_id=?, cgpa=?, backlogs=?, tenth_percent=?, twelth_percent=?, is_master=? WHERE user_id=?';
    const values = [details.batch, details.program_id, details.stream_id, details.cgpa, details.backlogs, details.tenth_percent, details.twelth_percent, details.is_master ? 1 : 0, userId];
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

studentModel.getStudentIdByUserId = async (userId) => {
  try {
      const query = 'SELECT student_id FROM students WHERE user_id = ?';
      const [rows] = await db.promise().query(query, [userId]);
      if (rows.length > 0) {
          return rows[0].student_id;
      } else {
          return null; // Return null if student not found
      }
  } catch (error) {
      console.error('Error fetching student ID by user ID:', error);
      throw error;
  }
};

// Function to check eligibility requirements against student data
studentModel.checkDriveEligibility = async (studentId, driveId) => {
  try {
      // Fetch student details
      const [studentRows] = await db.promise().execute('SELECT * FROM students WHERE student_id = ?', [studentId]);
      if (studentRows.length === 0) {
          throw new Error('Student not found');
      }
      const student = studentRows[0];

      // Fetch drive details
      const [driveRows] = await db.promise().execute('SELECT * FROM drives WHERE drive_id = ?', [driveId]);
      if (driveRows.length === 0) {
          throw new Error('Drive not found');
      }
      const drive = driveRows[0];

      // Check if the student's program ID and stream ID match with those specified for the drive
      const [driveForRows] = await db.promise().execute('SELECT * FROM drive_for WHERE drive_id = ?', [driveId]);
      const matchingDriveFor = driveForRows.find(df => df.program_id === student.program_id && df.stream_id === student.stream_id);
      if (!matchingDriveFor) {
          return false; // Program ID and/or stream ID do not match
      }

      // Check if student's 10th percentage, 12th percentage, and CGPA meet eligibility criteria
      if (student.tenth_percent >= drive.eligibility_10th &&
          student.twelth_percent >= drive.eligibility_12th &&
          student.cgpa >= drive.eligibility_cgpa) {
          return true; // Student meets eligibility criteria
      } else {
          return false; // Student does not meet eligibility criteria
      }
  } catch (error) {
      console.error('Error checking drive eligibility:', error);
      throw error;
  }
};

// Function to get student email by student ID
studentModel.getStudentEmailById = async (studentId) => {
  try {
      const query = 'SELECT email FROM students WHERE student_id = ?';
      const [rows] = await db.promise().execute(query, [studentId]);
      if (rows.length > 0) {
          return rows[0].email;
      }
      return null; // Return null if student not found
  } catch (error) {
      throw error;
  }
};

studentModel.getTotalStudents = async () => {
  try {
    const [result] = await db.promise().execute('SELECT COUNT(*) AS count FROM students');
    return result[0].count;
  } catch (error) {
    throw new Error('Error fetching total students');
  }
};

studentModel.getStudentEmailsForDrive = async (driveId) => {
  try {
    const query = `
      SELECT DISTINCT s.email
      FROM students AS s
      JOIN drive_for AS df ON s.program_id = df.program_id AND s.stream_id = df.stream_id
      WHERE df.drive_id = ?
    `;
    const [rows] = await db.promise().execute(query, [driveId]);
    const studentEmails = rows.map(row => row.email);
    return studentEmails;
  } catch (error) {
    throw error;
  }
};

module.exports = studentModel;