const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET: Fetch attendance records for a faculty’s subject
router.get('/', async (req, res) => {
  const subject = req.query.subject;
  console.log("Faculty Attendance GET request for subject:", subject);
  
  if (!subject) {
    return res.status(400).json({ error: 'Subject required' });
  }
  
  const query = `
    SELECT 
      TO_CHAR(ATTENDANCE_DATE, 'YYYY-MM-DD') AS ATTENDANCE_DATE,
      SUBJECT AS SUBJECT,
      STATUS AS STATUS,
      STUDENT_ID
    FROM ATTENDANCE 
    WHERE SUBJECT = :1
    ORDER BY ATTENDANCE_DATE
  `;
  
  try {
    const rows = await executeQuery(query, [subject]);
    // Return an empty array if no records exist
    if (!rows || rows.length === 0) {
      return res.json({ attendance: [] });
    }
    const attendance = rows.map(row => ({
      ATTENDANCE_DATE: row[0],
      SUBJECT: row[1],
      STATUS: row[2],
      STUDENT_ID: row[3]
    }));
    console.log("Transformed Attendance Data Retrieved:", attendance);
    res.json({ attendance });
  } catch (err) {
    console.error("Error fetching faculty attendance:", err);
    res.status(500).json({ error: 'Error fetching attendance' });
  }
});

// POST: Upload attendance for a faculty’s subject using MERGE to avoid duplicate entries
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
      
      // Use MERGE to update if a record exists for the same student, subject, and date; otherwise, insert.
      const mergeQuery = `
        MERGE INTO ATTENDANCE t
        USING (
          SELECT :1 AS STUDENT_ID,
                 TO_DATE(:2 || ' 00:00:00', 'YYYY-MM-DD HH24:MI:SS') AS ATTENDANCE_DATE,
                 :3 AS SUBJECT,
                 :4 AS STATUS
          FROM dual
        ) src
        ON (
          t.STUDENT_ID = src.STUDENT_ID 
          AND TO_CHAR(t.ATTENDANCE_DATE, 'YYYY-MM-DD') = TO_CHAR(src.ATTENDANCE_DATE, 'YYYY-MM-DD')
          AND t.SUBJECT = src.SUBJECT
        )
        WHEN MATCHED THEN
          UPDATE SET t.STATUS = src.STATUS
        WHEN NOT MATCHED THEN
          INSERT (ATTENDANCE_ID, STUDENT_ID, ATTENDANCE_DATE, SUBJECT, STATUS)
          VALUES (attendance_seq.NEXTVAL, src.STUDENT_ID, src.ATTENDANCE_DATE, src.SUBJECT, src.STATUS)
      `;
      await executeQuery(mergeQuery, [studentId, date, subject, status]);
    }
    res.json({ message: 'Attendance uploaded successfully' });
  } catch (err) {
    console.error("Error uploading faculty attendance:", err);
    res.status(500).json({ error: 'Error uploading attendance' });
  }
});

module.exports = router;
