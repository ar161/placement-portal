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

// Model function to check if the drive ID exists
driveModel.checkDriveExists = async (driveId) => {
    try {
        const query = 'SELECT COUNT(*) AS count FROM drives WHERE drive_id = ?';
        const [rows] = await db.promise().execute(query, [driveId]);
        return rows[0].count > 0;
    } catch (error) {
        throw error;
    }
};

// Model function to fetch the details of applied students for a drive
driveModel.getAppliedStudents = async (driveId) => {
    try {

        // Check if driveId is provided
        if (!driveId) {
            throw new Error("Drive ID is required.");
        }

        const query = `
            SELECT students.*, applications.drive_id 
            FROM students 
            INNER JOIN applications ON students.student_id = applications.student_id 
            WHERE applications.drive_id = ?`;
        const [rows] = await db.promise().execute(query, [driveId]);
        return rows;
    } catch (error) {
        throw error;
    }
};

driveModel.isDriveResultDeclared = async (driveId) => {
    try {
        const query = 'SELECT drive_result_declared FROM drives WHERE drive_id = ?';
        const [rows] = await db.promise().execute(query, [driveId]);
        if (rows.length > 0) {
            // If the drive is found, return whether the result is declared or not
            return rows[0].drive_result_declared;
        } else {
            // If the drive is not found, return null 
            return null;
            // or throw new Error('Drive not found');
        }
    } catch (error) {
        throw error;
    }
};

driveModel.updateDriveResultDeclared = async (driveId) => {
    try {
        const query = 'UPDATE drives SET drive_result_declared = ? WHERE drive_id = ?';
        const [result] = await db.promise().query(query, [true, driveId]);
        return result.affectedRows > 0; // Check if any rows were affected
    } catch (error) {
        console.error('Error updating drive result declared:', error);
        throw error;
    }
};

// Function to fetch upcoming drives based on student ID, program ID, and stream ID
driveModel.getUpcomingDrives = async (studentId) => {
    try {
        const query = `
        SELECT DISTINCT d.* 
        FROM drives d
        JOIN drive_for df ON d.drive_id = df.drive_id
        JOIN students s ON s.program_id = df.program_id AND s.stream_id = df.stream_id AND s.student_id = ?
        WHERE d.application_deadline > NOW()
        AND d.drive_id NOT IN (
            SELECT drive_id FROM applications WHERE student_id = ?
        )
        ORDER BY d.date_created DESC;
        `;
        const [rows] = await db.promise().query(query, [studentId, studentId]);
        return rows;
    } catch (error) {
        console.error('Error fetching upcoming drives:', error);
        throw error;
    }
};

// Function to fetch applied drives for a student
driveModel.getAppliedDrives = async (studentId) => {
    try {
        const query = `
            SELECT d.*
            FROM drives d
            JOIN applications a ON d.drive_id = a.drive_id
            WHERE a.student_id = ?
            ORDER BY a.date_applied DESC;
        `;
        const [rows] = await db.promise().query(query, [studentId]);
        return rows;
    } catch (error) {
        console.error('Error fetching applied drives:', error);
        throw error;
    }
};

// Function to get the final result status for a student in a drive
driveModel.getFinalResultStatus = async (studentId, driveId) => {
    try {
        // Check if the result has been declared for the drive
        const query = 'SELECT drive_result_declared FROM drives WHERE drive_id = ?';
        const [driveRows] = await db.promise().execute(query, [driveId]);
        const resultDeclared = driveRows[0].drive_result_declared === 1;

        if (!resultDeclared) {
            return 'Result Not Declared';
        }

        // Check if the student is placed in the drive
        const placedQuery = 'SELECT * FROM placed WHERE student_id = ? AND drive_id = ?';
        const [placedRows] = await db.promise().execute(placedQuery, [studentId, driveId]);

        if (placedRows.length > 0) {
            return 'Selected';
        } else {
            return 'Rejected';
        }
    } catch (error) {
        throw error;
    }
};

driveModel.getTotalDrivesCountForUser = async (userId) => {
    try {
      const query = `
        SELECT COUNT(*) AS count
        FROM drives AS d
        JOIN drive_for AS df ON d.drive_id = df.drive_id
        WHERE df.program_id = (
          SELECT s.program_id
          FROM students AS s
          WHERE s.user_id = ?
        ) AND df.stream_id = (
          SELECT s.stream_id
          FROM students AS s
          WHERE s.user_id = ?
        )
      `;
      const [result] = await db.promise().execute(query, [userId, userId]);
      return result[0].count;
    } catch (err) {
      throw err;
    }
  };

  driveModel.getAppliedDrivesCount = async (userId) => {
    try {
      const query = `
        SELECT COUNT(*) AS count
        FROM applications
        WHERE student_id = (
            SELECT s.student_id
            FROM students AS s
            WHERE s.user_id = ?
        )
      `;
      const [result] = await db.promise().execute(query, [userId]);
      return result[0].count;
    } catch (err) {
      throw err;
    }
  };

  driveModel.getUpcomingDrivesCount = async (userId) => {
    try {
      const query = `
        SELECT COUNT(*) AS count
        FROM drives AS d
        JOIN drive_for AS df ON d.drive_id = df.drive_id
        JOIN students AS s ON s.program_id = df.program_id AND s.stream_id = df.stream_id
        WHERE d.application_deadline > NOW() AND s.user_id = ?
      `;
      const [result] = await db.promise().execute(query, [userId]);
      return result[0].count;
    } catch (err) {
      throw err;
    }
  };

  driveModel.getTotalDrivesCount = async () => {
    try {
      const query = `
        SELECT COUNT(*) AS count
        FROM drives
      `;
      const [rows] = await db.promise().execute(query);
      const [{ count }] = rows;
      return count;
    } catch (error) {
      throw error;
    }
  };

  driveModel.getCompletedDrivesCount = async () => {
    try {
      const query = `
        SELECT COUNT(*) AS count
        FROM drives
        WHERE drive_result_declared = 1
      `;
      const [rows] = await db.promise().execute(query);
      const [{ count }] = rows;
      return count;
    } catch (error) {
      throw error;
    }
  };

module.exports = driveModel;