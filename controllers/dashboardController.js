// dashboardController.js

// Author: Raghav Agarwal
// Date: 18/01/2024
// Description: Dashboard Controller (/get dashboard and redirect to respective dashboard)

const userModel = require('../models/userModel');
const tpoModel = require('../models/tpoModel');
const studentModel = require('../models/studentModel');
const driveModel = require('../models/driveModel');

  exports.dashboardLanding = (req, res) => {
    const { role } = req.session.user;
    res.redirect(`/dashboard/${role}_dashboard`);
  };
  
  exports.adminDashboard = async (req, res) => {
    try {
      if (req.session.user && req.session.user.role === 'admin') 
      {
        const totalUsers = await userModel.getTotalUsers();
        const totalTPOs = await tpoModel.getTotalTPOs();
        const totalStudents = await studentModel.getTotalStudents();
        res.render('dashboard/admin_dashboard', {
          user: req.session.user,
          totalUsers,
          totalTPOs,
          totalStudents
        });
      } else {
        handleInvalidAccess(req, res);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      handleInvalidAccess(req, res);
    }
  };
  
  exports.studentDashboard = async (req, res) => {
    try {
      if (req.session.user && req.session.user.role === 'student') 
      {
        const totalDrives = await driveModel.getTotalDrivesCountForUser(req.session.user.id);
        const appliedDrives = await driveModel.getAppliedDrivesCount(req.session.user.id);
        const upcomingDrives = await driveModel.getUpcomingDrivesCount(req.session.user.id);
        res.render('dashboard/student_dashboard', {
          user: req.session.user,
          totalDrives,
          appliedDrives,
          upcomingDrives
          });
      } else {
        handleInvalidAccess(req, res);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      handleInvalidAccess(req, res);
    }
  };
  
  exports.officerDashboard = async (req, res) => {
    try {
      if (req.session.user && req.session.user.role === 'officer') 
      {
        const totalDrives = await driveModel.getTotalDrivesCount();
        const drivesCompleted = await driveModel.getCompletedDrivesCount();
        const totalStudents = await studentModel.getTotalStudents();
        res.render('dashboard/officer_dashboard', {
          user: req.session.user,
          totalDrives,
          drivesCompleted,
          totalStudents
          });
      } else {
        handleInvalidAccess(req, res);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
  