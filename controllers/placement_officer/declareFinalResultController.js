const driveModel = require('../../models/driveModel');
const roundModel = require('../../models/roundModel');
const selectedModel = require('../../models/selectedModel');
const placedModel = require('../../models/placedModel');

exports.declareFinalResult = async (req, res) => {
    const { driveId } = req.body;

    // Check if driveId is provided
    if (!driveId) {
        return res.status(400).json({ error: 'Drive ID is required' });
    }

    try {
        // Check if the drive exists
        const drive = await driveModel.getDriveById(driveId);
        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }

        // Check if the drive result has already been declared
        if (drive.drive_result_declared) {
            return res.status(400).json({ error: 'Drive result has already been declared' });
        }

        // Check if the result for the last round has been declared
        const lastRound = await roundModel.getLastRound(driveId);
        if (!lastRound) {
            return res.status(400).json({ error: 'No rounds found for this drive' });
        }
        const lastRoundResultDeclared = await roundModel.isRoundResultDeclared(lastRound.round_id);
        if (!lastRoundResultDeclared) {
            return res.status(400).json({ error: 'Result for the last round has not been declared' });
        }

        // Get the students shortlisted in the last round
        const selectedStudents = await selectedModel.getSelectedStudents(driveId, lastRound.round_id);

        // Insert selected students into the placed table
        await placedModel.insertPlacedStudents(driveId, selectedStudents);

        // Update the drive_result_declared field to true for the specified drive
        await driveModel.updateDriveResultDeclared(driveId);

        res.status(200).json({ success: 'Final result declared successfully' });
    } catch (error) {
        console.error('Error declaring final result:', error);
        res.status(500).json({ error: 'Failed to declare final result' });
    }
};
