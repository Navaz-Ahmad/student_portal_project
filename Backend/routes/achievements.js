// backend/routes/achievements.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET achievements for a student (all records)
router.get('/:id', async (req, res) => {
  const studentId = req.params.id;
  const query = `
    SELECT ACHIEVEMENT_ID, STUDENT_ID, ACHIEVEMENT_DESC, AWARD_NAME, 
           TO_CHAR(AWARD_DATE, 'YYYY-MM-DD') AS AWARD_DATE, CERTIFICATION, CREATED_AT
    FROM ACHIEVEMENTS
    WHERE STUDENT_ID = :1
  `;
  try {
    const result = await executeQuery(query, [studentId]);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Achievements not found' });
    }
    const achievements = result.map(row => ({
      achievement_id: row[0],
      student_id: row[1],
      achievement_desc: row[2],
      award_name: row[3],
      award_date: row[4],
      certification: row[5],
      created_at: row[6]
    }));
    res.json({ achievements });
  } catch (err) {
    console.error('Error fetching achievements:', err);
    res.status(500).json({ error: 'Error fetching achievements', details: err.message });
  }
});

// PUT: Update achievements for a student (update all records for simplicity)
router.put('/:id', async (req, res) => {
  const studentId = req.params.id;
  const { achievement_desc, award_name, award_date, certification } = req.body;
  const updateQuery = `
    UPDATE ACHIEVEMENTS
    SET ACHIEVEMENT_DESC = :1,
        AWARD_NAME = :2,
        AWARD_DATE = TO_DATE(:3, 'YYYY-MM-DD'),
        CERTIFICATION = :4
    WHERE STUDENT_ID = :5
  `;
  try {
    await executeQuery(updateQuery, [achievement_desc, award_name, award_date, certification, studentId]);
    // Re-query updated achievements:
    const selectQuery = `
      SELECT ACHIEVEMENT_ID, STUDENT_ID, ACHIEVEMENT_DESC, AWARD_NAME, 
             TO_CHAR(AWARD_DATE, 'YYYY-MM-DD') AS AWARD_DATE, CERTIFICATION, CREATED_AT
      FROM ACHIEVEMENTS
      WHERE STUDENT_ID = :1
    `;
    const result = await executeQuery(selectQuery, [studentId]);
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Achievements not found after update' });
    }
    const achievements = result.map(row => ({
      achievement_id: row[0],
      student_id: row[1],
      achievement_desc: row[2],
      award_name: row[3],
      award_date: row[4],
      certification: row[5],
      created_at: row[6]
    }));
    res.json({ achievements });
  } catch (err) {
    console.error('Error updating achievements:', err);
    res.status(500).json({ error: 'Error updating achievements', details: err.message });
  }
});

module.exports = router;
