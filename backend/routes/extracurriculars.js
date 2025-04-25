// backend/routes/extracurriculars.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET extracurricular activities for a student – return the first record as an object
router.get('/:id', async (req, res) => {
  const studentId = req.params.id;
  const query = `
    SELECT ACTIVITY_ID, STUDENT_ID, CLUBS, SPORTS, VOLUNTEER_ACTIVITIES, 
           LEADERSHIP_ROLES, OTHER_ACTIVITIES, CREATED_AT
    FROM EXTRACURRICULARS
    WHERE STUDENT_ID = :1
  `;
  try {
    const result = await executeQuery(query, [studentId]);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Extracurricular activities not found' });
    }
    // Return only the first record as an object
    const row = result[0];
    const extracurriculars = {
      activity_id: row[0],
      student_id: row[1],
      clubs: row[2],
      sports: row[3],
      volunteer_activities: row[4],
      leadership_roles: row[5],
      other_activities: row[6],
      created_at: row[7]
    };
    res.json({ extracurriculars });
  } catch (err) {
    console.error('Error fetching extracurriculars:', err);
    res.status(500).json({ error: 'Error fetching extracurriculars', details: err.message });
  }
});

// PUT: Update extracurricular activities for a student – update existing record and return it as an object
router.put('/:id', async (req, res) => {
  const studentId = req.params.id;
  const { clubs, sports, volunteer_activities, leadership_roles, other_activities } = req.body;
  const updateQuery = `
    UPDATE EXTRACURRICULARS
    SET CLUBS = :1,
        SPORTS = :2,
        VOLUNTEER_ACTIVITIES = :3,
        LEADERSHIP_ROLES = :4,
        OTHER_ACTIVITIES = :5
    WHERE STUDENT_ID = :6
  `;
  try {
    await executeQuery(updateQuery, [clubs, sports, volunteer_activities, leadership_roles, other_activities, studentId]);
    // Re-query updated extracurriculars:
    const selectQuery = `
      SELECT ACTIVITY_ID, STUDENT_ID, CLUBS, SPORTS, VOLUNTEER_ACTIVITIES, 
             LEADERSHIP_ROLES, OTHER_ACTIVITIES, CREATED_AT
      FROM EXTRACURRICULARS
      WHERE STUDENT_ID = :1
    `;
    const result = await executeQuery(selectQuery, [studentId]);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Extracurricular activities not found after update' });
    }
    const row = result[0];
    const extracurriculars = {
      activity_id: row[0],
      student_id: row[1],
      clubs: row[2],
      sports: row[3],
      volunteer_activities: row[4],
      leadership_roles: row[5],
      other_activities: row[6],
      created_at: row[7]
    };
    res.json({ extracurriculars });
  } catch (err) {
    console.error('Error updating extracurriculars:', err);
    res.status(500).json({ error: 'Error updating extracurriculars', details: err.message });
  }
});

module.exports = router;
