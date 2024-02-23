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

// Fetch round details by round ID
exports.getRoundById = async (roundId) => {
    try {
        const query = 'SELECT * FROM rounds WHERE round_id = ?';
        const [rows] = await db.promise().execute(query, [roundId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

// Fetch the ID of the previous round for a given drive and round ID
exports.getPreviousRoundId = async (driveId, roundId) => {
    try {
        const query = 'SELECT round_id FROM rounds WHERE drive_id = ? AND round_id < ? ORDER BY round_id DESC LIMIT 1';
        const [rows] = await db.promise().execute(query, [driveId, roundId]);
        return rows.length > 0 ? rows[0].round_id : null;
    } catch (error) {
        throw error;
    }
};

// Check if the specified drive belongs to the specified round
exports.checkDriveBelongsToRound = async (driveId, roundId) => {
    try {
        const query = 'SELECT COUNT(*) AS count FROM rounds WHERE drive_id = ? AND round_id = ?';
        const [rows] = await db.promise().execute(query, [driveId, roundId]);
        return rows[0].count === 1;
    } catch (error) {
        throw error;
    }
};

// Check if the round result has already been declared
exports.isRoundResultDeclared = async (roundId) => {
    try {
        const query = 'SELECT round_result_declared FROM rounds WHERE round_id = ?';
        const [rows] = await db.promise().execute(query, [roundId]);
        return rows[0].round_result_declared === 1;
    } catch (error) {
        throw error;
    }
};

// Update the round_result_declared field to true for the specified round
exports.updateRoundResultDeclared = async (roundId) => {
    try {
        const query = 'UPDATE rounds SET round_result_declared = ? WHERE round_id = ?';
        await db.promise().execute(query, [1, roundId]);
    } catch (error) {
        throw error;
    }
};

exports.getLastRound = async (driveId) => {
    try {
        const query = 'SELECT * FROM rounds WHERE drive_id = ? ORDER BY drive_round_sequence DESC LIMIT 1';
        const [rows] = await db.promise().query(query, [driveId]);
        return rows[0]; // Return the last round
    } catch (error) {
        console.error('Error getting last round:', error);
        throw error;
    }
};