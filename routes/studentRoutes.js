// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const addStudentDetailsController = require('../controllers/student/addStudentDetailsController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Add Student Details Form - Student
router.get('/add_student_details', isAuthenticated, roleMiddleware.checkStudent, addStudentDetailsController.renderAddStudentDetails);
router.post('/add_student_details', isAuthenticated, roleMiddleware.checkStudent, addStudentDetailsController.AddStudentDetails);

module.exports = router;