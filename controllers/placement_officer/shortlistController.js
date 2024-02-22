const driveModel = require('../../models/driveModel');
const roundModel = require('../../models/roundModel');
const selectedModel = require('../../models/selectedModel');
const studentModel = require('../../models/studentModel');

exports.renderShortlistStudents = async (req, res) => {
    const { driveId, roundId } = req.query;

    // Check if driveId & roundId is provided
    if (!driveId || !roundId) {
        return res.status(400).json({ error: 'Drive ID & Round ID is required' });
    }

    // Check if the drive exists
    const drive = await driveModel.getDriveById(driveId);
    if (!drive) {
        return res.status(404).json({ error: 'Drive not found' });
    }

    // Check if the round exists
    const round = await roundModel.getRoundById(roundId);
    if (!round) {
        return res.status(404).json({ error: 'Round not found' });
    }

    try {

        // Check if the specified drive belongs to the specified round
        const driveBelongsToRound = await roundModel.checkDriveBelongsToRound(driveId, roundId);
        if (!driveBelongsToRound) {
            return res.status(400).send('The specified drive does not belong to the specified round.');
        }

        
        let students;
        // Check if the current round is the first round
        if (round.drive_round_sequence === 1) {
            // Fetch students who applied for the drive
            students = await driveModel.getAppliedStudents(driveId);
        } else {
            // Fetch students selected from the previous round
            const previousRoundId = await roundModel.getPreviousRoundId(driveId, roundId);
            if (!previousRoundId) {
                return res.status(400).json({ error: 'No previous round found' });
            } else {
                const previousRoundResultDeclared = await roundModel.isRoundResultDeclared(previousRoundId);
                if (!previousRoundResultDeclared) {
                    return res.status(400).send('Result for the previous round has not been declared. Cannot shortlist students for this round.');
                }
            }
            students = await selectedModel.getSelectedStudents(driveId, previousRoundId);
        }

        res.render('placement_officer/shortlist_students', {
            drive,
            round,
            students
        });
    } catch (error) {
        console.error('Error rendering shortlist students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.shortlistStudents = async (req, res) => {
    const { driveId, roundId, selectedStudents } = req.body;

    // Check if driveId & roundId is provided
    if (!driveId || !roundId) {
        return res.status(400).json({ error: 'Drive ID & Round ID is required' });
    }

    try {

        // Check if the specified drive belongs to the specified round
        const driveBelongsToRound = await roundModel.checkDriveBelongsToRound(driveId, roundId);
        if (!driveBelongsToRound) {
            return res.status(400).send('The specified drive does not belong to the specified round.');
        }

        // Check if the round result has already been declared
        const roundResultDeclared = await roundModel.isRoundResultDeclared(roundId);
        if (roundResultDeclared) {
            return res.status(400).json({ error: 'Round result has already been declared. Cannot shortlist students again.' });
        }

        // Insert selected students into the database
        await selectedModel.insertSelectedStudents(driveId, roundId, selectedStudents);

        // Update the round_result_declared field to true for the specified round
        await roundModel.updateRoundResultDeclared(roundId);

        res.status(200).json({ success: 'Students shortlisted successfully' });
    } catch (error) {
        console.error('Error shortlisting students:', error);
        res.status(500).json({ error: 'Failed to shortlist students' });
    }
};
