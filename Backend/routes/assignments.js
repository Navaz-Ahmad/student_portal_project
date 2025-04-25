// backend/routes/assignments.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // use the verified uploads folder
  },
  filename: function (req, file, cb) {
    // Use studentId from req.body (or "unknown" if missing) and a timestamp to create a unique filename
    const studentId = req.body.studentId || 'unknown';
    const ext = path.extname(file.originalname);
    cb(null, `${studentId}-${Date.now()}${ext}`);
  }
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Existing GET endpoint to fetch assignments
router.get('/', async (req, res) => {
  const query = `
    SELECT 
      ASSIGNMENT_ID, 
      TITLE, 
      TO_CHAR(DESCRIPTION) AS DESCRIPTION,
      TO_CHAR(DUE_DATE, 'YYYY-MM-DD') AS DUE_DATE, 
      SUBJECT 
    FROM ASSIGNMENTS
  `;
  try {
    const rows = await executeQuery(query);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No assignments found' });
    }
    console.log('Assignments fetched:', rows);
    res.json({ assignments: rows });
  } catch (err) {
    console.error('Error in assignments endpoint:', err);
    res.status(500).json({ error: 'Error fetching assignments', details: err.message });
  }
});

// New endpoint to handle assignment submission uploads
router.post('/upload', upload.single('assignmentFile'), async (req, res) => {
  // Ensure that a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file format. Only PDFs are allowed.' });
  }
  
  // Get submitted fields from req.body
  const { studentId, assignmentId } = req.body;
  const filePath = req.file.path; // path where the file is stored

  // Insert submission record into your database (Assuming table ASSIGNMENT_SUBMISSIONS exists)
  const insertQuery = `
    INSERT INTO ASSIGNMENT_SUBMISSIONS (SUBMISSION_ID, STUDENT_ID, ASSIGNMENT_ID, FILE_PATH, SUBMITTED_AT)
    VALUES (ASSIGNMENT_SUBMISSIONS_SEQ.NEXTVAL, '${studentId}', '${assignmentId}', '${filePath}', CURRENT_TIMESTAMP)
  `;

  try {
    await executeQuery(insertQuery);
    console.log(`Assignment submission saved for student ${studentId} on assignment ${assignmentId}`);
    res.json({ message: 'Assignment uploaded successfully' });
  } catch (err) {
    console.error('Error uploading assignment:', err);
    res.status(500).json({ error: 'Error uploading assignment', details: err.message });
  }
});

// New endpoint to fetch submission records for a given student
router.get('/submissions', async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required' });
  }
  const query = `
    SELECT 
      SUBMISSION_ID, 
      STUDENT_ID, 
      ASSIGNMENT_ID, 
      FILE_PATH, 
      TO_CHAR(SUBMITTED_AT, 'YYYY-MM-DD HH24:MI:SS') AS SUBMITTED_AT
    FROM ASSIGNMENT_SUBMISSIONS
    WHERE STUDENT_ID = '${studentId}'
  `;
  try {
    const rows = await executeQuery(query);
    res.json({ submissions: rows });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Error fetching submissions', details: err.message });
  }
});

module.exports = router;
