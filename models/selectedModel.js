// selectedModel.js

const db = require('../config/db');

exports.getSelectedStudents = async (driveId, roundId) => {
    try {
        const query = `
            SELECT students.*, selected.drive_id 
            FROM students 
            INNER JOIN selected ON students.student_id = selected.student_id 
            WHERE selected.drive_id = ? AND selected.round_id = ?`;
        const [selectedStudents] = await db.promise().query(query, [driveId, roundId]);
        return selectedStudents;
    } catch (error) {
        console.error('Error fetching selected students:', error);
        throw error;
    }
};

exports.insertSelectedStudents = async (driveId, roundId, selectedStudents) => {
    try {
        // Start a transaction
        await db.promise().beginTransaction();

        // Loop through the selectedStudents array and insert each student into the selected table
        for (const studentId of selectedStudents) {
            await db.promise().query('INSERT INTO selected (drive_id, round_id, student_id) VALUES (?, ?, ?)', [driveId, roundId, studentId]);
        }

        // Commit the transaction if all insertions are successful
        await db.promise().commit();
    } catch (error) {
        // Rollback the transaction if any error occurs
        await db.promise().rollback();
        throw error;
    }
};
