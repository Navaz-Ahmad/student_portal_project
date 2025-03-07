// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { executeQuery } = require('./db');

// Import route modules
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const attendanceRoutes = require('./routes/attendance');
const materialsRoutes = require('./routes/materials');
const leaderboardRoutes = require('./routes/leaderboard');
const calendarRoutes = require('./routes/calendar');
const forumRoutes = require('./routes/forum');

const app = express();

// Enable CORS (adjust origin if needed)
app.use(cors({
    origin: 'http://localhost:3001', // React app will run here
    credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: false,
    saveUninitialized: true
}));

// Use API routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/forum', forumRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(3001, () => {
    console.log('Backend API server running on http://localhost:3001');
});
