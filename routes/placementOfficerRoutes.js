// placementOfficerRoutes.js
const express = require('express');
const router = express.Router();
const placementOfficerController = require('../controllers/placementOfficerController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Add Student route
router.get('/add_student', isAuthenticated, roleMiddleware.checkOfficer, placementOfficerController.renderAddStudent);
router.post('/add_student', isAuthenticated, roleMiddleware.checkOfficer, placementOfficerController.addStudent);

module.exports = router;
