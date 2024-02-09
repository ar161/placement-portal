// dashboardController.js

// Author: Raghav Agarwal
// Date: 18/01/2024
// Description: Dashboard Controller (/get dashboard and redirect to respective dashboard)

  exports.dashboardLanding = (req, res) => {
    const { role } = req.session.user;
    res.redirect(`/dashboard/${role}_dashboard`);
  };
  
  exports.adminDashboard = (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
      res.render('dashboard/admin_dashboard', { user: req.session.user });
    } else {
      handleInvalidAccess(req, res);
    }
  };
  
  exports.studentDashboard = (req, res) => {
    if (req.session.user && req.session.user.role === 'student') {
      res.render('dashboard/student_dashboard', { user: req.session.user });
    } else {
      handleInvalidAccess(req, res);
    }
  };
  
  exports.officerDashboard = (req, res) => {
    if (req.session.user && req.session.user.role === 'officer') {
      res.render('dashboard/officer_dashboard', { user: req.session.user });
    } else {
      handleInvalidAccess(req, res);
    }
  };
  
  // Function to handle invalid access (logout and redirect to login)
  const handleInvalidAccess = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/login');
    });
  };
  