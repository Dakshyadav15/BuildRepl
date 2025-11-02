// backend/app.js

const express = require('express');
const app = express();

// --- Put all your middleware here ---
// It looks like you're missing this. You'll need it.
app.use(express.json({ extended: false }));

// --- Define All Your Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
// ... (add any other routes)

// --- DO NOT call app.listen() here ---
// --- DO NOT connect to MongoDB here ---

// Just export the app
module.exports = app;