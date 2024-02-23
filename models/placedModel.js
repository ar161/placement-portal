// placedModel.js

const db = require('../config/db');

exports.insertPlacedStudents = async (driveId, students) => {
    const values = students.map(student => [driveId, student.student_id]);
    const query = 'INSERT INTO placed (drive_id, student_id) VALUES ?';
    await db.promise().query(query, [values]);
};
