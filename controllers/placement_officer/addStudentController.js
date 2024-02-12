// addStudentController.js
const db = require('../../config/db'); 
const xlsx = require('xlsx');
const fs = require('fs');
const userModel = require('../../models/userModel');
const studentModel = require('../../models/studentModel');

exports.renderAddStudent = (req, res) => {
    res.render('placement_officer/add_student', { error: null, success: null });
};

exports.addStudent = (req, res) => {
    const { username, name, email } = req.body;

    studentModel.createStudent(username, name, email, (err, results) => {
        if (err) {
          if (err === 'Username already exists') {
            return res.render('placement_officer/add_student', { error: 'Username already exists', success: null });
          }
    
          console.error('Error creating Student:', err);
          return res.render('placement_officer/add_student', { error: 'Error adding Student', success: null });
        }
    
        // Redirect to the Add Student Page with a success message
        res.render('placement_officer/add_student', { error: null, success: 'Student added successfully' });
      });
};

exports.addStudentsFromFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file || !file.path) {
      return res.render('placement_officer/add_student', { error: 'No file uploaded', success: null });
    }

    const filePath = file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Check for duplicate usernames within the file
    const usernamesInFile = data.map(student => student.Username);
    const uniqueUsernamesInFile = new Set(usernamesInFile);

    if (usernamesInFile.length !== uniqueUsernamesInFile.size) {
      fs.unlinkSync(file.path); // Delete the uploaded file
      return res.render('placement_officer/add_student', { error: 'Duplicate usernames found in the file', success: null });
    }

    const studentsToAdd = [];
    const errors = [];

    data.forEach((student, index) => {
      const { Username, Name, Email } = student; // Column headers are Username, Name, and Email

      // Validate student data
      if (!Username || !Name || !Email) {
        errors.push({ row: index + 1, message: 'Incomplete student data' });
      } else {
        studentsToAdd.push({ Username, Name, Email });
      }
    });

    if (errors.length > 0) {
      fs.unlinkSync(filePath);
      return res.render('placement_officer/add_student', { error: 'Invalid data in Excel file', success: null });
    }

    // Check for duplicate usernames in the database
    const duplicateUsernames = await userModel.checkDuplicateUsernames(usernamesInFile);
    if (duplicateUsernames.length > 0) {
      fs.unlinkSync(filePath);
      return res.render('placement_officer/add_student', { error: 'Duplicate usernames found in the database', success: null });
    }

    const { successes, errors: studentErrors } = await studentModel.createStudentsFromFile(studentsToAdd);

    if (studentErrors.length === 0) {
      fs.unlinkSync(filePath);
      return res.render('placement_officer/add_student', { error: null, success: `Successfully added ${successes.length} students` });
    } else {
      fs.unlinkSync(filePath);
      return res.render('placement_officer/add_student', { error: 'Failed to add students', success: null });
    }

  } catch (error) {
    fs.unlinkSync(filePath);
    res.render('placement_officer/add_student', { error: error.message, success: null });
  }
};