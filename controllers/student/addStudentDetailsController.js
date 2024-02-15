const studentModel = require('../../models/studentModel');
const streamModel = require('../../models/streamModel');

const addStudentDetailsController = {
    renderAddStudentDetails: (req, res) => {
        const userId = req.session.user.id;

        studentModel.getStudentDetails(userId, (err, student) => {
            if (err) {
                console.error('Error fetching student details:', err);
                return res.render('error', { message: 'Error fetching student details' });
            }

            studentModel.getStudentIsMaster(userId, (err, isMaster) => {
                if (err) {
                    console.error('Error fetching is_master:', err);
                    return res.render('error', { message: 'Error fetching student details' });
                }

                res.render('student/add_student_details', {
                    isMaster: isMaster,
                    student: student,
                    success: null,
                    error: null
                });
            });
        });
    },

    AddStudentDetails: (req, res) => {
        const userId = req.session.user.id;
        const { batch, program, stream, cgpa, backlogs, tenth_percent, twelth_percent } = req.body;

        const program_id = program;
        const stream_id = stream;

        let fetchedStudent;
        studentModel.getStudentDetails(userId, (err, student) => {
            if (err) {
                console.error('Error fetching student details:', err);
            }
            else {
                fetchedStudent = student;
            }
        });

        studentModel.getStudentIsMaster(userId, (err, isMaster) => {
            if (err) {
                console.error('Error fetching is_master:', err);
                return res.render('student/add_student_details', { error: 'Error fetching student details', isMaster: null, success: null, student: fetchedStudent });
            }

            if (isMaster) {
                return res.render('student/add_student_details', { error: 'Cannot submit. Student details are already locked.', isMaster: isMaster, success: null, student: fetchedStudent });
            }

            // Validate if all required fields are filled
            if (!batch || !program_id || !stream_id || !cgpa || !backlogs || !tenth_percent || !twelth_percent) {
                return res.render('student/add_student_details', { error: 'Please fill all required fields', isMaster: isMaster, success: null, student: fetchedStudent });
            }

            // Check if the selected stream belongs to the selected program
            streamModel.getProgramStreams(program_id, (err, programStreams) => {
                if (err) {
                    console.error('Error fetching program streams:', err);
                    return res.render('error', { message: 'Error fetching program streams' });
                }

                const validStream = programStreams.some(programStream => programStream.stream_id === parseInt(stream_id));
                if (!validStream) {
                    return res.render('student/add_student_details', { error: 'Selected stream does not belong to the selected program', isMaster: isMaster, success: null, student: fetchedStudent });
                }

                // Update student record in the database
                studentModel.updateStudentDetails(userId, {
                    batch: batch,
                    program_id: program_id,
                    stream_id: stream_id,
                    cgpa: cgpa,
                    backlogs: backlogs,
                    tenth_percent: tenth_percent,
                    twelth_percent: twelth_percent,
                    is_master: 1 // Set is_master to true after updating all details
                }, (err) => {
                    if (err) {
                        console.error('Error updating student details:', err);
                        return res.render('student/add_student_details', { error: 'Error updating details. Please try again.', isMaster: isMaster, success: null, student: fetchedStudent });
                    } else {
                        // Fetch updated student details
                        studentModel.getStudentDetails(userId, (err, student) => {
                            if (err) {
                                console.error('Error fetching student details:', err);
                                return res.render('student/add_student_details', { error: 'Error fetching student details', isMaster: null, success: null, student: null });
                            }
                            
                            return res.render('student/add_student_details', { error: null, success: 'Student details submitted successfully!', isMaster: student.is_master, student: student });
                        });
                    }
                });
            });
        });
    }
};

module.exports = addStudentDetailsController;