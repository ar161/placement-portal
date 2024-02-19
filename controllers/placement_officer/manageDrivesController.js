// manageDrivesController.js

const driveModel = require('../../models/driveModel');


// Controller to render the manage drives page
exports.renderManageDrivesPage = (req, res) => {
    res.render('placement_officer/manage_drives');
};

// Controller function to fetch current drives
exports.getCurrentDrives = async (req, res) => {
    try {
        const currentDrives = await driveModel.getDrivesByStatus(false); // Fetch current drives
        res.json(currentDrives); // Send the current drives as JSON response
    } catch (error) {
        console.error('Error fetching current drives:', error);
        res.status(500).json({ error: 'Error fetching current drives' });
    }
};

// Controller function to fetch completed drives
exports.getCompletedDrives = async (req, res) => {
    try {
        const completedDrives = await driveModel.getDrivesByStatus(true); // Fetch completed drives
        res.json(completedDrives); // Send the completed drives as JSON response
    } catch (error) {
        console.error('Error fetching completed drives:', error);
        res.status(500).json({ error: 'Error fetching completed drives' });
    }
};
