// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const addStudentDetailsController = require('../controllers/student/addStudentDetailsController');
const viewDriveListController = require('../controllers/student/viewDriveListController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Add Student Details Form - Student
router.get('/add_student_details', isAuthenticated, roleMiddleware.checkStudent, addStudentDetailsController.renderAddStudentDetails);
router.post('/add_student_details', isAuthenticated, roleMiddleware.checkStudent, addStudentDetailsController.AddStudentDetails);

// Route to List Upcoming & Applied Drives
router.get('/view_drive_list', isAuthenticated, roleMiddleware.checkStudent, viewDriveListController.renderViewDriveListPage);
router.get('/view_drive_list/upcoming', isAuthenticated, roleMiddleware.checkStudent, viewDriveListController.getUpcomingDrives);
router.get('/view_drive_list/applied', isAuthenticated, roleMiddleware.checkStudent, viewDriveListController.getAppliedDrives);

module.exports = router;