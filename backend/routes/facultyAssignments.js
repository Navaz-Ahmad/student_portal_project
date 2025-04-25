const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET: Fetch assignments for a given subject and facultyId
router.get('/', async (req, res) => {
  const { subject, facultyId } = req.query;
  console.log("FacultyAssignments GET request - subject:", subject, "facultyId:", facultyId);
  
  if (!subject || !facultyId) {
    return res.status(400).json({ error: 'Subject and facultyId are required' });
  }
  
  const query = `
    SELECT 
      ASSIGNMENT_ID,
      TITLE,
      DESCRIPTION,
      TO_CHAR(DUE_DATE, 'YYYY-MM-DD') AS DUE_DATE,
      SUBJECT,
      FACULTY_ID
    FROM ASSIGNMENTS
    WHERE SUBJECT = :1 AND FACULTY_ID = :2
    ORDER BY DUE_DATE DESC
  `;
  
  try {
    const rows = await executeQuery(query, [subject, facultyId]);
    if (!rows || rows.length === 0) {
      return res.json({ assignments: [] });
    }
    const assignments = rows.map(row => ({
      assignmentId: row[0],
      title: row[1],
      description: row[2],
      dueDate: row[3],
      subject: row[4],
      facultyId: row[5]
    }));
    console.log("Transformed Assignments Data Retrieved:", assignments);
    res.json({ assignments });
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ error: 'Error fetching assignments', details: err.message });
  }
});

// POST: Upload a new assignment (with provided assignmentId)
router.post('/upload', async (req, res) => {
  const { assignmentId, title, description, dueDate, subject, facultyId } = req.body;
  if (!assignmentId || !title || !description || !dueDate || !subject || !facultyId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const query = `
    INSERT INTO ASSIGNMENTS (ASSIGNMENT_ID, TITLE, DESCRIPTION, DUE_DATE, SUBJECT, FACULTY_ID)
    VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5, :6)
  `;
  try {
    const result = await executeQuery(query, [assignmentId, title, description, dueDate, subject, facultyId]);
    console.log("Assignment upload result:", result);
    // Updated check: rowsAffected is a number, not an array
    if (result && result.rowsAffected && result.rowsAffected > 0) {
      res.json({ message: 'Assignment uploaded successfully.' });
    } else {
      res.status(500).json({ error: 'Failed to upload assignment.' });
    }
  } catch (err) {
    console.error("Error uploading assignment:", err);
    res.status(500).json({ error: 'Error uploading assignment', details: err.message });
  }
});

module.exports = router;
