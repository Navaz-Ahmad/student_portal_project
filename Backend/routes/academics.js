// backend/routes/academics.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET academic details for a student
router.get('/:id', async (req, res) => {
  const studentId = req.params.id;
  const query = `
    SELECT ACADEMIC_ID, STUDENT_ID, COURSE_NAME, UNIVERSITY, DEPARTMENT, 
           YEAR_OF_STUDY, SEMESTER, CGPA, PERCENTAGE, BACKLOGS, 
           ATTENDANCE, ELECTIVE_COURSES, PROJECTS, INTERNSHIPS, 
           CERTIFICATIONS, RESEARCH_PAPERS, ACHIEVEMENTS, CREATED_AT
    FROM ACADEMICS
    WHERE STUDENT_ID = :1
  `;
  try {
    const result = await executeQuery(query, [studentId]);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Academic details not found' });
    }
    const row = result[0];
    const academics = {
      academic_id: row[0],
      student_id: row[1],
      course_name: row[2],
      university: row[3],
      department: row[4],
      year_of_study: row[5],
      semester: row[6],
      cgpa: row[7],
      percentage: row[8],
      backlogs: row[9],
      attendance: row[10],
      elective_courses: row[11],
      projects: row[12],
      internships: row[13],
      certifications: row[14],
      research_papers: row[15],
      achievements: row[16],
      created_at: row[17]
    };
    res.json({ academics });
  } catch (err) {
    console.error('Error fetching academics:', err);
    res.status(500).json({ error: 'Error fetching academic details', details: err.message });
  }
});

// PUT: Update academic details for a student (with UPSERT logic)
router.put('/:id', async (req, res) => {
  const studentId = req.params.id;
  const {
    course_name,
    university,
    department,
    year_of_study,
    semester,
    cgpa,
    percentage,
    backlogs,
    attendance,
    elective_courses,
    projects,
    internships,
    certifications,
    research_papers,
    achievements
  } = req.body;

  // First, attempt to update an existing record
  const updateQuery = `
    UPDATE ACADEMICS
    SET COURSE_NAME = :1,
        UNIVERSITY = :2,
        DEPARTMENT = :3,
        YEAR_OF_STUDY = :4,
        SEMESTER = :5,
        CGPA = :6,
        PERCENTAGE = :7,
        BACKLOGS = :8,
        ATTENDANCE = :9,
        ELECTIVE_COURSES = :10,
        PROJECTS = :11,
        INTERNSHIPS = :12,
        CERTIFICATIONS = :13,
        RESEARCH_PAPERS = :14,
        ACHIEVEMENTS = :15
    WHERE STUDENT_ID = :16
  `;
  try {
    await executeQuery(updateQuery, [
      course_name,
      university,
      department,
      year_of_study,
      semester,
      cgpa,
      percentage,
      backlogs,
      attendance,
      elective_courses,
      projects,
      internships,
      certifications,
      research_papers,
      achievements,
      studentId
    ]);
    // Re-query to see if a record exists:
    const selectQuery = `
      SELECT ACADEMIC_ID, STUDENT_ID, COURSE_NAME, UNIVERSITY, DEPARTMENT, 
             YEAR_OF_STUDY, SEMESTER, CGPA, PERCENTAGE, BACKLOGS, 
             ATTENDANCE, ELECTIVE_COURSES, PROJECTS, INTERNSHIPS, 
             CERTIFICATIONS, RESEARCH_PAPERS, ACHIEVEMENTS, CREATED_AT
      FROM ACADEMICS
      WHERE STUDENT_ID = :1
    `;
    let result = await executeQuery(selectQuery, [studentId]);
    // If no record exists, then insert a new record.
    if (!result || result.length === 0) {
      const insertQuery = `
        INSERT INTO ACADEMICS (
          ACADEMIC_ID, STUDENT_ID, COURSE_NAME, UNIVERSITY, DEPARTMENT,
          YEAR_OF_STUDY, SEMESTER, CGPA, PERCENTAGE, BACKLOGS,
          ATTENDANCE, ELECTIVE_COURSES, PROJECTS, INTERNSHIPS,
          CERTIFICATIONS, RESEARCH_PAPERS, ACHIEVEMENTS, CREATED_AT
        )
        VALUES (
          ACADEMICS_SEQ.NEXTVAL, :1, :2, :3, :4, :5, :6, :7, :8, :9,
          :10, :11, :12, :13, :14, :15, :16, SYSDATE
        )
      `;
      await executeQuery(insertQuery, [
        studentId,
        course_name,
        university,
        department,
        year_of_study,
        semester,
        cgpa,
        percentage,
        backlogs,
        attendance,
        elective_courses,
        projects,
        internships,
        certifications,
        research_papers,
        achievements
      ]);
      result = await executeQuery(selectQuery, [studentId]);
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Academic details not found after update' });
    }
    const row = result[0];
    const academicsResult = {
      academic_id: row[0],
      student_id: row[1],
      course_name: row[2],
      university: row[3],
      department: row[4],
      year_of_study: row[5],
      semester: row[6],
      cgpa: row[7],
      percentage: row[8],
      backlogs: row[9],
      attendance: row[10],
      elective_courses: row[11],
      projects: row[12],
      internships: row[13],
      certifications: row[14],
      research_papers: row[15],
      achievements: row[16],
      created_at: row[17]
    };
    res.json({ academics: academicsResult });
  } catch (err) {
    console.error('Error updating academics:', err);
    res.status(500).json({ error: 'Error updating academic details', details: err.message });
  }
});

module.exports = router;
