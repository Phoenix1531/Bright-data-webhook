const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Flexible Schema Setup
const dynamicSchema = new mongoose.Schema({}, { strict: false });
const DynamicModel = mongoose.model('Dynamic', dynamicSchema);

// POST Endpoint
app.post('/webhook', async (req, res) => {
    try {
        const data = req.body;
        const record = new DynamicModel(data);
        await record.save();
        res.status(200).json({ success: true, message: 'Data saved successfully!', data: record });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ success: false, message: 'Failed to save data.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
