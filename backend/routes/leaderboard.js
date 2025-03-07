// backend/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

router.get('/', async (req, res) => {
    const query = "SELECT STUDENT_ID, POINTS, RANK FROM LEADERBOARD ORDER BY RANK ASC";
    try {
        const leaderboard = await executeQuery(query);
        res.json({ leaderboard });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching leaderboard' });
    }
});

module.exports = router;
