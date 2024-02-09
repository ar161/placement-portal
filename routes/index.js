// app/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
