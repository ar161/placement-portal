// placementOfficerRoutes.js
const express = require('express');
const router = express.Router();
const addStudentController = require('../controllers/placement_officer/addStudentController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Add Student route
router.get('/add_student', isAuthenticated, roleMiddleware.checkOfficer, addStudentController.renderAddStudent);
router.post('/add_student', isAuthenticated, roleMiddleware.checkOfficer, addStudentController.addStudent);

//Add Students From Excel File
router.post('/add_students_from_file', isAuthenticated, roleMiddleware.checkOfficer, upload.single('file'), addStudentController.addStudentsFromFile);

module.exports = router;
