// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const addStudentDetailsController = require('../controllers/student/addStudentDetailsController');
const viewDriveListController = require('../controllers/student/viewDriveListController');
const viewDriveStudentController = require('../controllers/student/viewDriveStudentController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Add Student Details Form - Student
router.get('/add_student_details', isAuthenticated, roleMiddleware.checkStudent, addStudentDetailsController.renderAddStudentDetails);
router.post('/add_student_details', isAuthenticated, roleMiddleware.checkStudent, addStudentDetailsController.AddStudentDetails);

// Route to List Upcoming & Applied Drives
router.get('/view_drive_list', isAuthenticated, roleMiddleware.checkStudent, viewDriveListController.renderViewDriveListPage);
router.get('/view_drive_list/upcoming', isAuthenticated, roleMiddleware.checkStudent, viewDriveListController.getUpcomingDrives);
router.get('/view_drive_list/applied', isAuthenticated, roleMiddleware.checkStudent, viewDriveListController.getAppliedDrives);


// Route to View Drive
router.get('/view_drive', isAuthenticated, roleMiddleware.checkStudent, viewDriveStudentController.renderViewDriveStudentPage);
//Route to get Status of a Round
router.get('/view_drive/round_status', isAuthenticated, roleMiddleware.checkStudent, viewDriveStudentController.getRoundStatus);
// Route to get the final result status for a student in a drive
router.get('/view_drive/final_result_status', isAuthenticated, roleMiddleware.checkStudent, viewDriveStudentController.getFinalResultStatus);
// Route to apply for drive
router.post('/view_drive/apply_for_drive', isAuthenticated, roleMiddleware.checkStudent, viewDriveStudentController.applyForDrive);

module.exports = router;