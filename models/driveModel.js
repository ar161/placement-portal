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

module.exports = driveModel;