// roleMiddleware.js

// Author: 
// Date: 
// Description: Check Role to implement Role Based Access

const checkRole = (allowedRole) => {
    return (req, res, next) => {
      const { role } = req.session.user;
  
      if (allowedRole.includes(role)) {
        return next();
      } else {
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
          }
          res.redirect('/login');
        });
      }
    };
  };
  
  module.exports = {
    checkAdmin: checkRole('admin'),
    checkStudent: checkRole('student'),
    checkOfficer: checkRole('officer'),
    checkOfficerOrStudent: checkRole(['officer', 'student']),
  };
  