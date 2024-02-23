// manageDrivesController.js

const driveModel = require('../../models/driveModel');
const studentModel = require('../../models/studentModel');


// Controller to render the manage drives page
exports.renderViewDriveListPage = (req, res) => {
    res.render('student/view_drive_list');
};

// Controller function to fetch upcoming drives
exports.getUpcomingDrives = async (req, res) => {
    const userId = req.session.user.id;
    try {
        // Fetch student ID using the user ID
        const studentId = await studentModel.getStudentIdByUserId(userId);
        if (!studentId) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const upcomingDrives = await driveModel.getUpcomingDrives(studentId);
        res.json(upcomingDrives);
    } catch (error) {
        console.error('Error fetching upcoming drives:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming drives' });
    }
};

// Controller function to fetch applied drives
exports.getAppliedDrives = async (req, res) => {
    const userId = req.session.user.id;

    try {
        // Fetch student ID using the user ID
        const studentId = await studentModel.getStudentIdByUserId(userId);
        if (!studentId) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const appliedDrives = await driveModel.getAppliedDrives(studentId);
        res.json(appliedDrives);
    } catch (error) {
        console.error('Error fetching applied drives:', error);
        res.status(500).json({ error: 'Failed to fetch applied drives' });
    }
};