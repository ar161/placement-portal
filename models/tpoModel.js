// models/tpoModel.js
const db = require('../config/db');

exports.getAllTPOs = (callback) => {
    const query = 'SELECT * FROM placement_officers';
    db.query(query, callback);
};
