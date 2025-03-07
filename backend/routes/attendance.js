// backend/routes/attendance.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

router.get('/', async (req, res) => {
    // For simplicity, studentId is provided as a query parameter. (In production, use authentication middleware)
    const studentId = req.query.studentId;
    if (!studentId) return res.status(400).json({ error: 'Student ID required' });
    
    const query = `
        SELECT ATTENDANCE_ID, SUBJECT, TO_CHAR(ATTENDANCE_DATE, 'YYYY-MM-DD') AS ATTENDANCE_DATE, STATUS 
        FROM ATTENDANCE 
        WHERE STUDENT_ID = :1
    `;
    try {
        const attendance = await executeQuery(query, [studentId]);
        res.json({ attendance });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching attendance' });
    }
});

module.exports = router;
