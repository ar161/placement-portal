// adminController.js
const tpoModel = require('../models/tpoModel');

// controllers/adminController.js
exports.renderAddPlacementOfficer = (req, res) => {
    res.render('admin/add_placement_officer', { error: null, success: null });
  };
    
exports.addPlacementOfficer = (req, res) => {
    const { username, name, email, contactNo } = req.body;
  
    tpoModel.createPlacementOfficer(username, name, email, contactNo, (err, results) => {
      if (err) {
        if (err === 'Username already exists') {
          return res.render('admin/add_placement_officer', { error: 'Username already exists', success: null });
        }
  
        console.error('Error creating placement officer:', err);
        return res.render('admin/add_placement_officer', { error: 'Error adding placement officer', success: null });
      }
  
      // Redirect to the Add Placement Officer Page with a success message
      res.render('admin/add_placement_officer', { error: null, success: 'Placement officer added successfully' });
    });
};

exports.viewTPOs = (req, res) => {
  tpoModel.getAllTPOs((err, rows) => {
      if (err) {
          console.error('Error fetching TPOs:', err);
          // Handle error
          return res.status(500).send('Error fetching TPOs');
      }
      // Render the view with TPO data
      res.render('admin/view_tpo', { tpos: rows });
  });
};
  


