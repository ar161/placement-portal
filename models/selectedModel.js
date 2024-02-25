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

// Model function to get round status for a student in a specific round of a drive
exports.getRoundStatus = async (driveId, roundId, studentId) => {
    try {
        const query = `
            SELECT 
                CASE 
                    WHEN s.student_id IS NOT NULL THEN 'Selected'
                    ELSE 'Rejected' 
                END AS status
            FROM 
                selected s
            WHERE 
            s.drive_id = ? AND s.round_id = ? AND s.student_id = ?;
        `;
        const [rows] = await db.promise().execute(query, [driveId, roundId, studentId]);
        return rows.length > 0 ? rows[0].status : 'Rejected';
    } catch (error) {
        console.error('Error fetching round status for student:', error);
        throw error;
    }
};