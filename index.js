const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Flexible Schema Setup
const dynamicSchema = new mongoose.Schema({}, { strict: false });
const DynamicModel = mongoose.model('Dynamic', dynamicSchema);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/ping", (req, res) => {
    res.send("pong");
});


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


