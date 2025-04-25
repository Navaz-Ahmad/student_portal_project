// backend/routes/students.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');
router.get('/', async (req, res) => {
  const subject = req.query.subject;
  
  if (!subject) {
    return res.status(400).json({ error: 'Subject required' });
  }
  
  // Query to join STUDENTS, STUDENT_SUBJECTS, and STUDENT_DETAILS
  const query = `
    SELECT 
      s.STUDENT_ID, 
      s.NAME, 
      d.DOB, 
      d.GENDER, 
      d.PHONE_NUMBER
    FROM STUDENTS s
    JOIN STUDENT_SUBJECTS ss ON s.STUDENT_ID = ss.STUDENT_ID
    LEFT JOIN STUDENT_DETAILS d ON s.STUDENT_ID = d.STUDENT_ID
    WHERE ss.SUBJECT = :1
  `;
  
  try {
    const rows = await executeQuery(query, [subject]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No students found for this subject' });
    }
    const students = rows.map(row => ({
      id: row[0],
      name: row[1],
      dob: row[2],
      gender: row[3],
      phoneNumber: row[4]
    }));
    res.json({ students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

module.exports = router;
router.get('/', async (req, res) => {
  const subject = req.query.subject;
  
  if (!subject) {
    return res.status(400).json({ error: 'Subject required' });
  }
  
  const query = `
    SELECT 
      ID, 
      NAME 
    FROM STUDENTS 
    WHERE SUBJECT = :1
  `;
  
  try {
    const rows = await executeQuery(query, [subject]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No students found for this subject' });
    }
    // Transform each row into an object
    const students = rows.map(row => ({
      id: row[0],
      name: row[1]
    }));
    res.json({ students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

module.exports = router;
router.get('/:id', async (req, res) => {
  const studentId = req.params.id;
  const studentQuery = `
    SELECT STUDENT_ID AS id, NAME AS name, EMAIL AS email, BRANCH AS branch
    FROM STUDENTS WHERE STUDENT_ID = :1
  `;
  const detailsQuery = `
    SELECT DOB, GENDER, PHONE_NUMBER, PERMANENT_ADDRESS, CURRENT_ADDRESS, NATIONALITY, GUARDIAN_NAME, GUARDIAN_CONTACT
    FROM STUDENT_DETAILS WHERE STUDENT_ID = :1
  `;
  try {
    const studentResult = await executeQuery(studentQuery, [studentId]);
    const detailsResult = await executeQuery(detailsQuery, [studentId]);
    if (!studentResult || studentResult.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const studentRow = studentResult[0];
    const student = {
      id: studentRow[0],
      name: studentRow[1],
      email: studentRow[2],
      branch: studentRow[3] || 'Not provided',
      dob: 'Not provided',
      gender: 'Not provided',
      phone_number: 'Not provided',
      permanent_address: 'Not provided',
      current_address: 'Not provided',
      nationality: 'Not provided',
      guardian_name: 'Not provided',
      guardian_contact: 'Not provided'
    };

    if (detailsResult && detailsResult.length > 0) {
      const detailsRow = detailsResult[0];
      student.dob = detailsRow[0] ? detailsRow[0].toISOString().split('T')[0] : 'Not provided';
      student.gender = detailsRow[1] || 'Not provided';
      student.phone_number = detailsRow[2] || 'Not provided';
      student.permanent_address = detailsRow[3] || 'Not provided';
      student.current_address = detailsRow[4] || 'Not provided';
      student.nationality = detailsRow[5] || 'Not provided';
      student.guardian_name = detailsRow[6] || 'Not provided';
      student.guardian_contact = detailsRow[7] || 'Not provided';
    }
    res.json({ student });
  } catch (err) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT route to update student profile details
router.put('/:id', async (req, res) => {
  const studentId = req.params.id;
  const { name, email, year_of_study, branch, dob, gender, phone_number, permanent_address, current_address, nationality, guardian_name, guardian_contact } = req.body;

  // Update STUDENTS table
  const updateStudentQuery = `
    UPDATE STUDENTS
    SET NAME = :1, EMAIL = :2, BRANCH = :3
    WHERE STUDENT_ID = :5
  `;

  // Update STUDENT_DETAILS table
  const updateDetailsQuery = `
    UPDATE STUDENT_DETAILS
    SET DOB = TO_DATE(:1, 'YYYY-MM-DD'),
        GENDER = :2,
        PHONE_NUMBER = :3,
        PERMANENT_ADDRESS = :4,
        CURRENT_ADDRESS = :5,
        NATIONALITY = :6,
        GUARDIAN_NAME = :7,
        GUARDIAN_CONTACT = :8
    WHERE STUDENT_ID = :9
  `;

  try {
    await executeQuery(updateStudentQuery, [name, email, branch, studentId]);
    await executeQuery(updateDetailsQuery, [dob, gender, phone_number, permanent_address, current_address, nationality, guardian_name, guardian_contact, studentId]);

    // After update, fetch the updated profile:
    const studentQuery = `
      SELECT STUDENT_ID AS id, NAME AS name, EMAIL AS email,BRANCH AS branch
      FROM STUDENTS WHERE STUDENT_ID = :1
    `;
    const detailsQuery = `
      SELECT DOB, GENDER, PHONE_NUMBER, PERMANENT_ADDRESS, CURRENT_ADDRESS, NATIONALITY, GUARDIAN_NAME, GUARDIAN_CONTACT
      FROM STUDENT_DETAILS WHERE STUDENT_ID = :1
    `;
    const studentResult = await executeQuery(studentQuery, [studentId]);
    const detailsResult = await executeQuery(detailsQuery, [studentId]);

    let updatedStudent = {};
    if (studentResult && studentResult.length > 0) {
      const row = studentResult[0];
      updatedStudent = {
        id: row[0],
        name: row[1],
        email: row[2],
        branch: row[3]
      };
    }
    if (detailsResult && detailsResult.length > 0) {
      const drow = detailsResult[0];
      updatedStudent.dob = drow[0] ? drow[0].toISOString().split('T')[0] : 'Not provided';
      updatedStudent.gender = drow[1] || 'Not provided';
      updatedStudent.phone_number = drow[2] || 'Not provided';
      updatedStudent.permanent_address = drow[3] || 'Not provided';
      updatedStudent.current_address = drow[4] || 'Not provided';
      updatedStudent.nationality = drow[5] || 'Not provided';
      updatedStudent.guardian_name = drow[6] || 'Not provided';
      updatedStudent.guardian_contact = drow[7] || 'Not provided';
    }
    res.json({ student: updatedStudent });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Error updating profile', details: err.message });
  }
});

module.exports = router;
