// programPlanningController.js

const programModel = require('../../models/programModel');

exports.renderProgramPlanning = (req, res) => {
    res.render('placement_officer/program_planning');
};

exports.getAllPrograms = (req, res) => {
    programModel.getAllPrograms((err, programs) => {
        if (err) {
            console.error('Error fetching programs:', err);
            return res.status(500).json({ error: 'Error fetching programs' });
        }
        res.json(programs);
    });
};

exports.addProgram = (req, res) => {
    const { programName } = req.body;
    if (!programName) {
        return res.status(400).json({ error: 'Program name is required' });
    }
    programModel.addProgram(programName, (err, result) => {
        if (err) {
            console.error('Error adding program:', err);
            return res.status(500).json({ error: 'Error adding program' });
        }
        res.json({ success: 'Program added successfully', programId: result.insertId });
    });
};

exports.editProgram = (req, res) => {
    const { programId, programName } = req.body;
    if (!programId || !programName) {
        return res.status(400).json({ error: 'Program ID and name are required' });
    }
    programModel.editProgram(programId, programName, (err, result) => {
        if (err) {
            console.error('Error editing program:', err);
            return res.status(500).json({ error: 'Error editing program' });
        }
        res.json({ success: 'Program edited successfully' });
    });
};

exports.deleteProgram = (req, res) => {
    const { programId } = req.body;
    if (!programId) {
        return res.status(400).json({ error: 'Program ID is required' });
    }
    programModel.deleteProgram(programId, (err, result) => {
        if (err) {
            console.error('Error deleting program:', err);
            return res.status(500).json({ error: 'Error deleting program' });
        }
        res.json({ success: 'Program deleted successfully' });
    });
};
