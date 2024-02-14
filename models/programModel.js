// programModel.js

const db = require('../config/db');

const programModel = {};

programModel.getAllPrograms = (callback) => {
    const query = 'SELECT * FROM programs';
    db.query(query, (err, rows) => {
        if (err) {
            callback(new Error('Error fetching programs from the database'), null);
            return;
        }
        callback(null, rows);
    });
};

programModel.addProgram = (programName, callback) => {
    const query = 'INSERT INTO programs (program_name) VALUES (?)';
    db.query(query, [programName], (err, result) => {
        if (err) {
            callback(new Error('Error adding program to the database'), null);
            return;
        }
        callback(null, result);
    });
};

programModel.editProgram = (programId, programName, callback) => {
    const query = 'UPDATE programs SET program_name = ? WHERE program_id = ?';
    db.query(query, [programName, programId], (err, result) => {
        if (err) {
            callback(new Error('Error editing program in the database'), null);
            return;
        }
        callback(null, result);
    });
};

programModel.deleteProgram = (programId, callback) => {
    const query = 'DELETE FROM programs WHERE program_id = ?';
    db.query(query, [programId], (err, result) => {
        if (err) {
            callback(new Error('Error deleting program from the database'), null);
            return;
        }
        callback(null, result);
    });
};

module.exports = programModel;
