const studentModel = require('../../models/studentModel');
const userModel = require('../../models/userModel');

const editStudentDetailsController = {
    renderEditStudentDetails: (req, res) => {
        res.render('placement_officer/edit_student_details', {
            student: null,
            error: null
        });
    },

    fetchStudentDetails: (req, res) => {
        const username = req.body.username;

        studentModel.isStudentUsername(username, (err, userId) => {
            if (err) {
                console.error('Error checking if username belongs to a student:', err);
                return res.status(500).json({ error: 'Error checking if username belongs to a student' });
            }

            if (!userId) {
                return res.status(404).json({ error: 'Username does not belong to a student' });
            }

            // If username belongs to a student, fetch their details
            studentModel.getStudentDetails(userId, (err, student) => {
                if (err) {
                    console.error('Error fetching student details:', err);
                    return res.status(500).json({ error: 'Error fetching student details' });
                }

                if (!student) {
                    return res.status(404).json({ error: 'Student not found' });
                }

                return res.status(200).json({ student: student });
            });
        });
    },

    updateStudentDetails: (req, res) => {
        const { username, batch, program, stream, cgpa, backlogs, tenth_percent, twelth_percent } = req.body;
    
        // Validate if all required fields are filled
        if (!username || !batch || !program || !stream || !cgpa || !backlogs || !tenth_percent || !twelth_percent) {
            return res.status(400).json({ error: 'Please fill all required fields' });
        }
    
        userModel.getUserIDByUsername(username, (err, userId) => {
            if (err) {
                console.error('Error fetching user_id:', err);
                return res.status(500).json({ error: 'Error fetching user ID' });
            }
    
            if (!userId) {
                return res.status(404).json({ error: 'User not found or not a student' });
            }

            // Continue with checking if the authenticated user is allowed to update student details
            studentModel.getStudentIsMaster(userId, (err, isMaster) => {
                if (err) {
                    console.error('Error fetching is_master:', err);
                    return res.status(500).json({ error: 'Error fetching student details' });
                }
    
                if (!isMaster) {
                    return res.status(403).json({ error: 'Edit Disabled due to Incomplete Data' });
                }

                // Update student record in the database
                studentModel.updateStudentDetails(userId, {
                    batch: batch,
                    program: program,
                    stream: stream,
                    cgpa: cgpa,
                    backlogs: backlogs,
                    tenth_percent: tenth_percent,
                    twelth_percent: twelth_percent,
                    is_master: 1 // Keep is_master to true after updating all details
                }, (err) => {
                    if (err) {
                        console.error('Error updating student details:', err);
                        return res.status(500).json({ error: 'Error updating details. Please try again.' });
                    } else {
                        return res.status(200).json({ success: 'Student details updated successfully!' });
                    }
                });
            });
        });
    }        
};

module.exports = editStudentDetailsController;