// models/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'placement_portal',
  port: 3306,
});

module.exports = db;