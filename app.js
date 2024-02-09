// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
const routes = require('./routes');

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.use(routes);

db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
