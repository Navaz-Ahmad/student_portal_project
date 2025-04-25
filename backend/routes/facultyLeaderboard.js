const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// Get faculty leaderboard data (with id)
router.get('/', async (req, res) => {
    const query = 
      `SELECT id, STUDENT_ID, POINTS, RANK, EVENT_NAME, EVENT_DATE 
      FROM LEADERBOARD 
      ORDER BY EVENT_DATE ASC, RANK ASC
    `;
    try {
        // executeQuery returns an array of arrays
        const rows = await executeQuery(query);

        // Map each row (array) into an object with keys
        const leaderboard = rows.map(row => ({
            id: row[0],
            student_id: row[1],
            points: row[2],
            rank: row[3],
            event_name: row[4],
            event_date: row[5]
        }));

        res.json({ leaderboard });
    } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        res.status(500).json({ error: 'Error fetching faculty leaderboard' });
    }
});

// Add student points, rank, event to leaderboard
router.post('/add', async (req, res) => {
    const { student_id, points, rank, event_name, event_date } = req.body;

    if (!student_id || !points || !rank || !event_name || !event_date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = 
      `INSERT INTO LEADERBOARD (STUDENT_ID, POINTS, RANK, EVENT_NAME, EVENT_DATE)
      VALUES (:1, :2, :3, :4, TO_DATE(:5, 'YYYY-MM-DD'))
    `;
    
    try {
        console.log("Received data for insertion:", req.body);
        await executeQuery(query, [student_id, points, rank, event_name, event_date]);
        res.json({ message: "Leaderboard updated successfully" });
    } catch (err) {
        console.error("Error adding leaderboard entry:", err);
        res.status(500).json({ error: err.message || "Error adding leaderboard entry" });
    }
});
// Update a leaderboard entry by id
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { student_id, points, rank, event_name, event_date } = req.body;
  if (!student_id || !points || !rank || !event_name || !event_date) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = 
    `UPDATE LEADERBOARD
     SET STUDENT_ID = :1, POINTS = :2, RANK = :3, EVENT_NAME = :4, EVENT_DATE = TO_DATE(:5, 'YYYY-MM-DD')
     WHERE id = :6`;
  try {
    await executeQuery(query, [student_id, points, rank, event_name, event_date, id]);
    res.json({ message: "Leaderboard updated successfully" });
  } catch (err) {
    console.error("Error updating leaderboard entry:", err);
    res.status(500).json({ error: err.message || "Error updating leaderboard entry" });
  }
});


module.exports = router;
