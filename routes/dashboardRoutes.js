// dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Dashboard landing page
router.get('/dashboard', isAuthenticated, dashboardController.dashboardLanding);

// Define routes for different roles using consolidated middleware
router.get('/dashboard/admin_dashboard', isAuthenticated, roleMiddleware.checkAdmin, dashboardController.adminDashboard);
router.get('/dashboard/student_dashboard', isAuthenticated, roleMiddleware.checkStudent, dashboardController.studentDashboard);
router.get('/dashboard/officer_dashboard', isAuthenticated, roleMiddleware.checkOfficer, dashboardController.officerDashboard);

module.exports = router;