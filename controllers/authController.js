// app/controllers/authController.js

// Author: Raghav Agarwal
// Date: 18/01/2024
// Description: Authentication Controller (/get Login, /Post Login, /logout)

const userModel = require('../models/userModel');

exports.login = (req, res) => {
  res.render('login', { error: undefined });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;

  userModel.getUser(username, password, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const user = results[0];

      // Set user object in the session with role
      req.session.user = { id: user.id, username: user.username, role: user.role };

      // Redirect to the dashboard landing page
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};