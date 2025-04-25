const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// Import route modules
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const attendanceRoutes = require('./routes/attendance');
const materialsRoutes = require('./routes/materials');
const leaderboardRoutes = require('./routes/leaderboard');
const calendarRoutes = require('./routes/calendar');
const studentRoutes = require('./routes/students');  
const facultyAttendanceRoutes = require('./routes/facultyAttendance');
const facultyAssignmentsRoutes = require('./routes/facultyAssignments');
const facultyMaterialsRoutes = require('./routes/facultyMaterials');
const facultyCalendarRoutes = require('./routes/facultyCalendar');
const facultyLeaderboardRoutes = require('./routes/facultyLeaderboard');





const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  
    httpOnly: true, 
    sameSite: 'Lax' 
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/academics', require('./routes/academics'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/extracurriculars', require('./routes/extracurriculars'));
app.use('/api/facultyAttendance', facultyAttendanceRoutes);
app.use('/api/facultyAssignments', facultyAssignmentsRoutes);
app.use('/api/facultyMaterials', facultyMaterialsRoutes);
app.use('/api/facultyCalendar', facultyCalendarRoutes);
app.use('/api/facultyLeaderboard', facultyLeaderboardRoutes);


app.use('/uploads', express.static('uploads'));


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3001, () => {
  console.log('Backend API server running on http://localhost:3001');
});
