// streamModel.js

const db = require('../config/db');

const streamModel = {
    createStream: (name, programId, callback) => {
        const query = 'INSERT INTO streams (stream_name, program_id) VALUES (?, ?)';
        db.query(query, [name, programId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            const newStreamId = results.insertId;
            callback(null, newStreamId);
        });
    },

    findAllStreams : (callback) => {
        const query = `
            SELECT streams.stream_id, streams.stream_name, programs.program_name
            FROM streams
            INNER JOIN programs ON streams.program_id = programs.program_id
        `;
        db.query(query, (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        });
    },

    updateStream: (streamId, name, callback) => {
        const query = 'UPDATE streams SET stream_name = ? WHERE stream_id = ?';
        db.query(query, [name, streamId], (err, results) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    },

    deleteStream: (streamId, callback) => {
        const query = 'DELETE FROM streams WHERE stream_id = ?';
        db.query(query, [streamId], (err, results) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    },
    
    getProgramStreams: (programId, callback) => {
        const query = 'SELECT stream_id, stream_name FROM streams WHERE program_id = ?';
        db.query(query, [programId], (err, streams) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, streams);
        });
    },

    getStreamById : (streamId, callback) => {
        const query = 'SELECT * FROM streams WHERE stream_id = ?';
        db.query(query, [streamId], (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            if (rows.length === 0) {
                return callback(null, null);
            }
            callback(null, rows[0]);
        });
    }
};

module.exports = streamModel;