// uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// Define the temporary directory path
const tempDirectory = path.join(__dirname, '../uploads/temp');

// Create a multer storage engine that stores files in the temporary directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDirectory);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only Excel files
    if (
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

module.exports = upload;