// app/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/', authRoutes);
router.use('/', dashboardRoutes);

module.exports = router;
