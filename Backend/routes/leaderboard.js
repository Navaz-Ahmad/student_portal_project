// backend/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');


router.get('/', async (req, res) => {
    // Updated query to include event_name and event_date,
    // and ordering by event_date then rank.
    const query = "SELECT STUDENT_ID, POINTS, RANK, event_name, event_date FROM LEADERBOARD ORDER BY event_date ASC, RANK ASC";
    try {
      const leaderboard = await executeQuery(query);
      res.json({ leaderboard });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching leaderboard' });
    }
  });
  

module.exports = router;
