// app/models/userModel.js
const db = require('../config/db');

const userModel = {
  getUser: (username, password, callback) => {
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], callback);
  }
};

module.exports = userModel;
