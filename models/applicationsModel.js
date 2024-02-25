// applicationsMode.js

const db = require('../config/db');

// Function to get the drive application status for a specific user and drive
exports.getDriveApplicationStatus = async (studentId, driveId) => {
    try {
        const query = 'SELECT * FROM applications WHERE student_id = ? AND drive_id = ?';
        const [row] = await db.promise().query(query, [studentId, driveId]);
        
        // If a row is found, return the applied status, otherwise return false
        return row.length > 0 ? true : false;
    } catch (error) {
        console.error('Error fetching drive application status:', error);
        throw error;
    }
};

// Function to insert a student for a drive
exports.applyForDrive = async (driveId, studentId) => {
    try {
        const query = 'INSERT INTO applications (drive_id, student_id) VALUES (?, ?)';
        const [result] = await db.promise().execute(query, [driveId, studentId]);
        return result.affectedRows > 0; // Returns true if a row was affected (i.e., insertion was successful)
    } catch (error) {
        console.error('Error applying for drive:', error);
        throw error;
    }
};
