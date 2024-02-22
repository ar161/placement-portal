// driveModel.js

const db = require('../config/db');

const driveModel = {};

driveModel.createDrive = async (driveData) => {
    const { company_name, batch, eligibility_10th, eligibility_12th, eligibility_cgpa, package_type, package_amount, date_of_drive, application_deadline, bond, job_location, job_role, job_description } = driveData;

    const insertDriveQuery = 'INSERT INTO drives (company_name, batch, eligibility_10th, eligibility_12th, eligibility_cgpa, package_type, package_amount, date_of_drive, application_deadline, bond, job_location, job_role, job_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    try {
        const [result] = await db.promise().query(insertDriveQuery, [company_name, batch, eligibility_10th, eligibility_12th, eligibility_cgpa, package_type, package_amount, date_of_drive, application_deadline, bond, job_location, job_role, job_description]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Model function to fetch drives based on status
driveModel.getDrivesByStatus = async (isCompleted) => {
    try {
        const query = 'SELECT * FROM drives WHERE drive_result_declared = ?';
        const [rows] = await db.promise().execute(query, [isCompleted]);
        return rows;
    } catch (error) {
        throw error;
    }
};

driveModel.getDriveById = async (driveId) => {
    try {
        const query = 'SELECT * FROM drives WHERE drive_id = ?';
        const [rows] = await db.promise().execute(query, [driveId]);
        return rows.length ? rows[0] : null; // Return the first row if found, otherwise return null
    } catch (error) {
        throw error;
    }
};

module.exports = driveModel;