// placementOfficerRoutes.js
const express = require('express');
const router = express.Router();
const addStudentController = require('../controllers/placement_officer/addStudentController');
const editStudentDetailsController = require('../controllers/placement_officer/editStudentDetailsController');
const programPlanningController = require('../controllers/placement_officer/programPlanningController');
const streamPlanningController = require('../controllers/placement_officer/streamPlanningController');
const createDriveController = require('../controllers/placement_officer/createDriveController');
const manageDrivesController = require('../controllers/placement_officer/manageDrivesController');
const viewDriveController = require('../controllers/placement_officer/viewDriveController');
const roundController = require('../controllers/placement_officer/roundController');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Add Student route
router.get('/add_student', isAuthenticated, roleMiddleware.checkOfficer, addStudentController.renderAddStudent);
router.post('/add_student', isAuthenticated, roleMiddleware.checkOfficer, addStudentController.addStudent);
//Add Students From Excel File
router.post('/add_students_from_file', isAuthenticated, roleMiddleware.checkOfficer, upload.single('file'), addStudentController.addStudentsFromFile);


// Render edit student details form
router.get('/edit_student_details', isAuthenticated, roleMiddleware.checkOfficer, editStudentDetailsController.renderEditStudentDetails);
// Fetch student details
router.post('/edit_student_details/fetch', isAuthenticated, roleMiddleware.checkOfficer, editStudentDetailsController.fetchStudentDetails);
// Update student details
router.post('/edit_student_details/update', isAuthenticated, roleMiddleware.checkOfficer, editStudentDetailsController.updateStudentDetails);


// Route to render the project planning page
router.get('/program_planning', isAuthenticated, roleMiddleware.checkOfficer, programPlanningController.renderProgramPlanning);

// Routes for handling programs
router.get('/program_planning/all', isAuthenticated, roleMiddleware.checkOfficerOrStudent, programPlanningController.getAllPrograms);
router.post('/program_planning/add', isAuthenticated, roleMiddleware.checkOfficer, programPlanningController.addProgram);
router.post('/program_planning/edit', isAuthenticated, roleMiddleware.checkOfficer, programPlanningController.editProgram);
router.post('/program_planning/delete', isAuthenticated, roleMiddleware.checkOfficer, programPlanningController.deleteProgram);


// Route to render the stream management page
router.get('/stream_planning', isAuthenticated, roleMiddleware.checkOfficer, streamPlanningController.renderStreamPlanning);

// Routes for handling streams
router.get('/stream_planning/all', isAuthenticated, roleMiddleware.checkOfficer, streamPlanningController.getAllStreams);
router.post('/stream_planning/add', isAuthenticated, roleMiddleware.checkOfficer, streamPlanningController.addStream);
router.post('/stream_planning/edit', isAuthenticated, roleMiddleware.checkOfficer, streamPlanningController.editStream);
router.post('/stream_planning/delete', isAuthenticated, roleMiddleware.checkOfficer, streamPlanningController.deleteStream);
router.get('/stream_planning/:programId', isAuthenticated, roleMiddleware.checkOfficerOrStudent, streamPlanningController.getProgramStreams);


// Render Drive Creation Form route
router.get('/create_drive', isAuthenticated, roleMiddleware.checkOfficer, createDriveController.renderCreateDrive);
// Create Drive route
router.post('/create_drive/add', isAuthenticated, roleMiddleware.checkOfficer, createDriveController.createDrive);


// Route to render Manage Drives page
router.get('/manage_drives',isAuthenticated, roleMiddleware.checkOfficer, manageDrivesController.renderManageDrivesPage);
// Route to fetch  Current drives
router.get('/manage_drives/current',isAuthenticated, roleMiddleware.checkOfficer, manageDrivesController.getCurrentDrives);
// Route to fetch  Completed drives
router.get('/manage_drives/completed',isAuthenticated, roleMiddleware.checkOfficer, manageDrivesController.getCompletedDrives);


router.get('/view_drive',isAuthenticated, roleMiddleware.checkOfficer, viewDriveController.renderViewDrive);
// Route to get the list of applied students for a drive
router.get('/view_drive/applied_students', isAuthenticated, roleMiddleware.checkOfficer, viewDriveController.renderAppliedStudents);

// Route to get the list of rounds for a drive
router.get('/view_drive/rounds', isAuthenticated, roleMiddleware.checkOfficer, roundController.getRoundsForDrive);
// Route to create rounds for a drive
router.post('/view_drive/create_round', isAuthenticated, roleMiddleware.checkOfficer, roundController.createRound);

module.exports = router;
