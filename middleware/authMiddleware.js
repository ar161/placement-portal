// app/middleware/authMiddleware.js
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.render('login', { error: 'Please Log in...' });
  }
};

module.exports = isAuthenticated;
