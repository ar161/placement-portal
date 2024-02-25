// viewDriveStudentController.js

const driveModel = require('../../models/driveModel');
const applicationsModel = require('../../models/applicationsModel');
const roundModel = require('../../models/roundModel');
const selectedModel = require('../../models/selectedModel');
const studentModel = require('../../models/studentModel');
// const driveForModel = require('../../models/driveForModel');

// Controller function to render the student view drive page
exports.renderViewDriveStudentPage = async (req, res) => {
    const userId = req.session.user.id;
    const driveId = req.query.driveId;

    // Check if driveId is provided
    if (!driveId) {
        return res.status(400).json({ error: 'Drive ID is required' });
    }

    try {

        const studentId = await studentModel.getStudentIdByUserId(userId);
        if (!studentId) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const drive = await driveModel.getDriveById(driveId);

        // Check if the drive is found
        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }

        const appliedStatus = await applicationsModel.getDriveApplicationStatus(studentId, driveId); // Fetch applied status for the current user
        // Render the student view drive page with drive details and applied status
        res.render('student/student_view_drive', { drive, appliedStatus });
    } catch (error) {
        console.error('Error rendering student view drive page:', error);
        res.status(500).json({ error: 'Failed to render student view drive page' });
    }
};

// Controller function to get status of a round for a student
exports.getRoundStatus = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const driveId = req.query.driveId;
        const roundId = req.query.roundId;

        // Validate input parameters
        if (!roundId || !driveId) {
            return res.status(400).json({ error: 'Round ID & DriveId is required' });
        }

        const studentId = await studentModel.getStudentIdByUserId(userId);
        if (!studentId) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if the student has applied for the drive
        const appliedStatus = await applicationsModel.getDriveApplicationStatus(studentId, driveId);

        // If the student hasn't applied, return appropriate message
        if (!appliedStatus) {
            return res.status(400).json({ error: 'You have not applied for this drive yet' });
        }

        // Check if the specified drive belongs to the specified round
        const driveBelongsToRound = await roundModel.checkDriveBelongsToRound(driveId, roundId);
        if (!driveBelongsToRound) {
            return res.status(400).send('The specified drive does not belong to the specified round.');
        }

        const roundResultDeclared = await roundModel.isRoundResultDeclared(roundId);
        if (!roundResultDeclared) {
            return res.status(400).json({ status: 'Result not declared' });
        }

        // Fetch round status for the student
        const roundStatus = await selectedModel.getRoundStatus(driveId, roundId, studentId);
        return res.json({ status: roundStatus });

    } catch (error) {
        console.error('Error fetching round status:', error);
        res.status(500).json({ error: 'Failed to fetch round status' });
    }
};

// Controller function to get the final result status for a student in a drive
exports.getFinalResultStatus = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const driveId = req.query.driveId;

        // Validate input parameters
        if (!driveId) {
            return res.status(400).json({ error: 'Drive ID is required' });
        }

        const studentId = await studentModel.getStudentIdByUserId(userId);
        if (!studentId) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if the student has applied for the drive
        const appliedStatus = await applicationsModel.getDriveApplicationStatus(studentId, driveId);

        // If the student hasn't applied, return appropriate message
        if (!appliedStatus) {
            return res.status(400).json({ error: 'You have not applied for this drive yet' });
        }

        // Fetch the final result status for the student in the drive
        const finalResultStatus = await driveModel.getFinalResultStatus(studentId, driveId);

        // Return the final result status
        res.json({ finalResultStatus });
    } catch (error) {
        console.error('Error fetching final result status:', error);
        res.status(500).json({ error: 'Failed to fetch final result status' });
    }
};

// Controller function to apply for the drive
exports.applyForDrive = async (req, res) => {
    const userId = req.session.user.id;
    const driveId = req.body.driveId;



    try {

        if (!driveId) {
            return res.status(400).json({ error: 'DriveId is required' });
        }

        const studentId = await studentModel.getStudentIdByUserId(userId);
        if (!studentId) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const isMaster = await new Promise((resolve, reject) => {
            studentModel.getStudentIsMaster(userId, (err, isMaster) => {
                if (err) {
                    console.error('Error fetching is_master:', err);
                    reject(err);
                } else {
                    resolve(isMaster);
                }
            });
        });

        if (!isMaster) {
            return res.status(403).json({ error: 'Cannot Apply due to Incomplete Data' });
        }

        // Check if the student meets eligibility criteria
        const isEligible = await studentModel.checkDriveEligibility(studentId, driveId);
        if (!isEligible) {
            return res.status(400).json({ error: 'Not Eligible For Drive' });
        }

        // Check if the application deadline has not passed
        const driveDetails = await driveModel.getDriveById(driveId);
        const deadline = new Date(driveDetails.application_deadline);
        if (new Date() > deadline) {
            return res.status(400).json({ error: 'Application deadline has passed' });
        }

        // Insert the student for the drive
        const result = await applicationsModel.applyForDrive(driveId, studentId);
        if (result) {
            res.status(200).json({ success: 'Successfully Applied for Drive' });
        } else {
            res.status(500).json({ error: 'Failed to apply for drive' });
        }

    } catch (error) {
        console.error('Error applying for drive:', error);
        res.status(500).json({ error: 'Failed to apply for drive' });
    }
};

