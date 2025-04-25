const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

router.get('/', async (req, res) => {
  const studentId = req.query.studentId;
  const subject = req.query.subject;
  
  console.log("Received request for attendance. Student ID:", studentId, "Subject:", subject);

  if (!studentId && !subject) {
    console.error("Error: Neither Student ID nor subject provided in the request.");
    return res.status(400).json({ error: 'Student ID or subject required' });
  }

  let query = '';
  let params = [];
  
  if (studentId) {
    query = `
      SELECT 
        TO_CHAR(ATTENDANCE_DATE, 'YYYY-MM-DD') AS ATTENDANCE_DATE,
        SUBJECT AS SUBJECT,
        STATUS AS STATUS
      FROM ATTENDANCE 
      WHERE STUDENT_ID = :1
    `;
    params = [studentId];
  } else {
    query = `
      SELECT 
        TO_CHAR(ATTENDANCE_DATE, 'YYYY-MM-DD') AS ATTENDANCE_DATE,
        SUBJECT AS SUBJECT,
        STATUS AS STATUS,
        STUDENT_ID
      FROM ATTENDANCE 
      WHERE SUBJECT = :1
    `;
    params = [subject];
  }

  try {
    const rows = await executeQuery(query, params);
    console.log("Attendance Data Retrieved (raw):", rows);
    // Instead of returning a 404 when no records exist, return an empty array
    if (!rows || rows.length === 0) {
      return res.json({ attendance: [] });
    }
    const attendance = rows.map(row => ({
      ATTENDANCE_DATE: row[0],
      SUBJECT: row[1],
      STATUS: row[2],
      ...(studentId ? {} : { STUDENT_ID: row[3] })
    }));
    console.log("Transformed Attendance Data Retrieved:", attendance);
    res.json({ attendance });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: 'Error fetching attendance' });
  }
});

// POST: Upload attendance for a faculty’s subject
router.post('/upload', async (req, res) => {
  const { subject, date, records } = req.body;
  
  console.log("Faculty Attendance POST request for subject:", subject, "date:", date);
  
  if (!subject || !date || !records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }
  
  try {
    for (const record of records) {
      const { studentId, status } = record;
      if (!studentId || !status) {
        continue; // Skip incomplete records
      }
      const insertQuery = `
        INSERT INTO ATTENDANCE (STUDENT_ID, ATTENDANCE_DATE, SUBJECT, STATUS)
        VALUES (:1, TO_DATE(:2 || ' 00:00:00', 'YYYY-MM-DD HH24:MI:SS'), :3, :4)
      `;
      await executeQuery(insertQuery, [studentId, date, subject, status]);
    }
    res.json({ message: 'Attendance uploaded successfully' });
  } catch (err) {
    console.error("Error uploading faculty attendance:", err);
    res.status(500).json({ error: 'Error uploading attendance' });
  }
});

module.exports = router;


