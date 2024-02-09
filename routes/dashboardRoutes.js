// dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Dashboard landing page
router.get('/', isAuthenticated, dashboardController.dashboardLanding);

// Define routes for different roles using consolidated middleware
router.get('/admin_dashboard', isAuthenticated, roleMiddleware.checkAdmin, dashboardController.adminDashboard);
router.get('/student_dashboard', isAuthenticated, roleMiddleware.checkStudent, dashboardController.studentDashboard);
router.get('/officer_dashboard', isAuthenticated, roleMiddleware.checkOfficer, dashboardController.officerDashboard);

module.exports = router;