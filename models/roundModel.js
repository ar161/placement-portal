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

// Function to create a new round
exports.createRound = async (driveId, roundName, roundDescription, roundDate) => {
    try {
        const query = 'INSERT INTO rounds (drive_id, round_name, round_description, round_date) VALUES (?, ?, ?, ?)';
        await db.promise().execute(query, [driveId, roundName, roundDescription, roundDate]);
    } catch (error) {
        throw error;
    }
};
