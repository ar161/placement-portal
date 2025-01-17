// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Add Placement Officer
router.get('/add_placement_officer', isAuthenticated, roleMiddleware.checkAdmin, adminController.renderAddPlacementOfficer);
router.post('/add_placement_officer', isAuthenticated, roleMiddleware.checkAdmin, adminController.addPlacementOfficer);

//View Placement Officer
router.get('/view_tpo', isAuthenticated, roleMiddleware.checkAdmin, adminController.viewTPOs);

module.exports = router;