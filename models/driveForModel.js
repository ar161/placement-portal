// driveForModel.js

const db = require('../config/db');

const driveForModel = {};

driveForModel.insertDriveForData = async (driveForData) => {
    // Check if driveForData is an array
    if (!Array.isArray(driveForData) || driveForData.length === 0) {
        throw new Error('Invalid input data');
    }

    // Prepare values for multiple insertions
    const values = driveForData.map(data => {
        const { drive_id, program_id, stream_id } = data;
        return [drive_id, program_id, stream_id];
    });

    const insertDriveForQuery = 'INSERT INTO drive_for (drive_id, program_id, stream_id) VALUES ?';

    try {
        const result = await db.promise().query(insertDriveForQuery, [values]);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = driveForModel;