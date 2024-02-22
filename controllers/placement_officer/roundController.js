const driveModel=require('../../models/driveModel');
const roundModel=require('../../models/roundModel');

exports.getRoundsForDrive = async (req, res) => {
    // Extract the driveId from the query parameters
    const driveId = req.query.driveId;

    // Check if driveId is provided
    if (!driveId) {
        return res.status(400).json({ error: 'Drive ID is required' });
    }

    // Check if the drive ID exists
    const driveExists = await driveModel.checkDriveExists(driveId);
    if (!driveExists) {
        return res.status(404).json({ error: 'Drive with the specified ID does not exist' });
    }

    try {
        // Fetch all rounds for the drive using RoundModel
        const rounds = await roundModel.getAllRoundsForDrive(driveId);
        res.json(rounds);
    } catch (error) {
        console.error('Error fetching rounds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createRound = async (req, res) => {
    const { driveId, roundName, roundDescription, roundDate } = req.body;

    // Validate if all required fields are filled
    if (!driveId || !roundName || !roundDescription || !roundDate) {
        return res.status(400).json({ error: 'Please fill all required fields' });
    }

    try {

        // Check if the drive ID exists
        const driveExists = await driveModel.checkDriveExists(driveId);
        if (!driveExists) {
            return res.status(404).json({ error: 'Drive with the specified ID does not exist' });
        }

        // Check if the drive result is already declared
        const driveResultDeclared = await driveModel.isDriveResultDeclared(driveId);
        if (driveResultDeclared) {
            return res.status(400).json({ error: 'Drive result is already declared. Cannot create a new round.' });
        }
        
        // Find the highest drive_round_sequence for the given drive
        const highestSequence = await roundModel.getHighestSequenceForDrive(driveId);

        // Increment the highest sequence by 1 to assign the next sequence number
        const nextSequence = highestSequence + 1;

        // Call a method in the roundModel to create the round
        await roundModel.createRound(driveId, roundName, roundDescription, roundDate, nextSequence );
        res.status(200).json({ success: 'Round created successfully' });
    } catch (error) {
        console.error('Error creating round:', error);
        res.status(500).json({ error: 'Failed to create round' });
    }
};