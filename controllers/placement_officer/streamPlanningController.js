// streamPlanningController.js

const streamModel = require('../../models/streamModel');

exports.renderStreamPlanning = (req, res) => {
    res.render('placement_officer/stream_planning');
};

exports.getAllStreams = (req, res) => {
    streamModel.findAllStreams((err, streams) => {
        if (err) {
            console.error('Error fetching streams:', err);
            return res.status(500).json({ error: 'Error fetching streams' });
        }
        res.json(streams);
    });
};

exports.addStream = (req, res) => {
    const { streamName, programId } = req.body;
    if (!streamName || !programId) {
        return res.status(400).json({ error: 'Stream name and program ID are required' });
    }
    streamModel.createStream(streamName, programId, (err, result) => {
        if (err) {
            console.error('Error adding stream:', err);
            return res.status(500).json({ error: 'Error adding stream' });
        }
        res.json({ success: 'Stream added successfully', streamId: result.insertId });
    });
};

exports.editStream = (req, res) => {
    const { streamId, streamName } = req.body;
    if (!streamId || !streamName) {
        return res.status(400).json({ error: 'Stream ID and name are required' });
    }
    streamModel.updateStream(streamId, streamName, (err, result) => {
        if (err) {
            console.error('Error editing stream:', err);
            return res.status(500).json({ error: 'Error editing stream' });
        }
        res.json({ success: 'Stream edited successfully' });
    });
};

exports.deleteStream = (req, res) => {
    const { streamId } = req.body;
    if (!streamId) {
        return res.status(400).json({ error: 'Stream ID is required' });
    }
    streamModel.deleteStream(streamId, (err, result) => {
        if (err) {
            console.error('Error deleting stream:', err);
            return res.status(500).json({ error: 'Error deleting stream' });
        }
        res.json({ success: 'Stream deleted successfully' });
    });
};

exports.getProgramStreams = (req, res) => {
    const { programId } = req.params;

    // Implement logic to fetch streams for the specified programId
    streamModel.getProgramStreams(programId, (err, streams) => {
        if (err) {
            console.error('Error fetching program streams:', err);
            return res.status(500).json({ error: 'Error fetching program streams' });
        }

        // Return the streams for the specified programId
        res.json(streams);
    });
};