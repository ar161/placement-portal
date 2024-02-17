// createDriveController.js
const driveModel = require('../../models/driveModel');
const driveForModel = require('../../models/driveForModel');
const programModel = require('../../models/programModel');
const streamModel = require('../../models/streamModel');
const db = require('../../config/db');

exports.renderCreateDrive = (req, res) => {
    res.render('placement_officer/create_drive');
};

// Controller function to create a new drive
exports.createDrive = async (req, res) => {
    const { company_name, batch, eligibility_10th, eligibility_12th, eligibility_cgpa, package_type, package_amount, date_of_drive, application_deadline, bond, job_location, job_role, job_description, program_ids, stream_ids } = req.body;

    try {
        // Validate if all required fields are filled
        if (!company_name || !batch || !package_type || !package_amount || !date_of_drive || !application_deadline || !job_location || !job_role || !job_description || !program_ids || !stream_ids) {
            return res.status(400).json({ error: 'Please fill all required fields' });
        }

        // Create a new drive record
        const driveData = {
            company_name: company_name,
            batch: batch,
            eligibility_10th: eligibility_10th || null,
            eligibility_12th: eligibility_12th || null,
            eligibility_cgpa: eligibility_cgpa || null,
            package_type: package_type,
            package_amount: package_amount,
            date_of_drive: date_of_drive,
            application_deadline: application_deadline,
            bond: bond || null,
            job_location: job_location,
            job_role: job_role,
            job_description: job_description
        };

        // Start transaction
        await db.promise().beginTransaction();

        // Insert drive record
        const driveResult = await driveModel.createDrive(driveData);
        const driveId = driveResult.insertId;

        // Insert data into drive_for table
        const driveForData = [];
        for (const programId of program_ids) {
            for (const streamId of stream_ids) {
                const isValid = await isValidProgramStreamCombination(programId, streamId);
                if (isValid) {
                    driveForData.push({
                        drive_id: driveId,
                        program_id: programId,
                        stream_id: streamId
                    });
                }
            }
        }

        // If driveForData is empty, roll back the transaction and throw an error
        if (driveForData.length === 0) {
            await db.promise().rollback();
            return res.status(400).json({ error: 'No valid program-stream combinations found' });
        }

        // Insert drive_for data
        await driveForModel.insertDriveForData(driveForData);

        // Commit transaction
        await db.promise().commit();

        res.status(200).json({ success: 'Drive created successfully' });
    } catch (error) {
        // Rollback transaction on error
        await db.promise().rollback();
        console.error('Error creating drive:', error);
        res.status(500).json({ error: 'Error creating drive' });
    }
};


// Function to check if the program-stream combination is valid
function isValidProgramStreamCombination(programId, streamId) {
    return new Promise((resolve, reject) => {
        // Check if the program exists
        programModel.getProgramById(programId, (err, program) => {
            if (err) {
                return reject(err);
            }
            if (!program) {
                return resolve(false);
            }

            // Check if the stream belongs to the program
            streamModel.getStreamById(streamId, (err, stream) => {
                if (err) {
                    return reject(err);
                }
                if (!stream) {
                    return resolve(false);
                }
                if (stream.program_id == programId) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    });
}