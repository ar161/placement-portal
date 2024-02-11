// placementOfficerRoutes.js
const express = require('express');
const router = express.Router();
const placementOfficerController = require('../controllers/placementOfficerController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Add Student route
router.get('/add_student', isAuthenticated, roleMiddleware.checkOfficer, placementOfficerController.renderAddStudent);
router.post('/add_student', isAuthenticated, roleMiddleware.checkOfficer, placementOfficerController.addStudent);4

//Add Students From Excel File
router.post('/add_students_from_file', isAuthenticated, roleMiddleware.checkOfficer, upload.single('file'), placementOfficerController.addStudentsFromFile);

module.exports = router;
