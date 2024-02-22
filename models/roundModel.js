const db = require('../config/db');

// Function to fetch all rounds for a specific drive
exports.getAllRoundsForDrive = async (driveId) => {
    try {
        const query = 'SELECT * FROM rounds WHERE drive_id = ?';
        const [rows] = await db.promise().execute(query, [driveId]);
        return rows;
    } catch (error) {
        throw error;
    }
};

// Function to get the highest drive_round_sequence for a given drive
exports.getHighestSequenceForDrive = async (driveId) => {
    try {
        const query = 'SELECT MAX(drive_round_sequence) AS highest_sequence FROM rounds WHERE drive_id = ?';
        const [rows] = await db.promise().execute(query, [driveId]);
        const highestSequence = rows[0].highest_sequence || 0;
        return highestSequence;
    } catch (error) {
        throw error;
    }
};

// Function to create a new round
exports.createRound = async (driveId, roundName, roundDescription, roundDate, nextSequence) => {
    try {
        const query = 'INSERT INTO rounds (drive_id, round_name, round_description, round_date, drive_round_sequence) VALUES (?, ?, ?, ?, ?)';
        await db.promise().execute(query, [driveId, roundName, roundDescription, roundDate, nextSequence]);
    } catch (error) {
        throw error;
    }
};
