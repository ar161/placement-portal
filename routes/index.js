// app/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const adminRoutes = require('./adminRoutes');
const placementOfficerRoutes = require('./placementOfficerRoutes');
const studentRoutes = require('./studentRoutes');

router.use('/', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/placement_officer', placementOfficerRoutes);
router.use('/student', studentRoutes);

module.exports = router;
