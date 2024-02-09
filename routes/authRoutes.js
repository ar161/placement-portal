// app/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Redirect root URL to login page
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', authController.login);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout); // Add logout route

module.exports = router;
