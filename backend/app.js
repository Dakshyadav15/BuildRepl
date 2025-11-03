// backend/app.js
const cors = require('cors');
const express = require('express');
const app = express();

// --- CORS Configuration ---
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    exposedHeaders: ['x-auth-token'],
  })
);

// --- Middleware ---
app.use(express.json({ limit: '50mb', extended: false }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Define All Your Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/search', require('./routes/search'));
// Just export the app
module.exports = app;
