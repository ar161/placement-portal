const driveModel = require('../../models/driveModel');


exports.renderViewDrive = async (req, res) => {
    // Extract the driveId from the query parameters
    const driveId = req.query.driveId;

    // Check if driveId is provided
    if (!driveId) {
        return res.status(400).json({ error: 'Drive ID is required' });
    }

    try {
        const drive = await driveModel.getDriveById(driveId);

        // Check if the drive is found
        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }

        // Render the view_drive page with drive details
        res.render('placement_officer/view_drive', { drive });
    } catch (error) {
        console.error('Error fetching drive details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.renderAppliedStudents = async (req, res) => {
    try {
        const driveId = req.query.driveId;
        if (!driveId) {
            return res.status(400).json({ error: 'Drive ID is required' });
        }

        // Check if the drive ID exists
        const driveExists = await driveModel.checkDriveExists(driveId);
        if (!driveExists) {
            return res.status(404).json({ error: 'Drive with the specified ID does not exist' });
        }
        
        // Fetch the list of applied students for the specified drive from the model
        const appliedStudents = await driveModel.getAppliedStudents(driveId);
        // Render the view to display the list of applied students
        res.render('placement_officer/applied_students', { appliedStudents });
    } catch (error) {
        console.error('Error fetching applied students:', error);
        res.status(500).send('Internal Server Error');
    }
};