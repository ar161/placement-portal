// placementOfficerController.js
const studentModel = require('../models/studentModel');

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
