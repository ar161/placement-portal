// app/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout); // Add logout route

module.exports = router;
