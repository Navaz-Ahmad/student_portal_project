// backend/routes/calendar.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

router.get('/', async (req, res) => {
    // Assuming a CALENDAR_EVENTS table exists with EVENT_ID, TITLE, EVENT_DATE, DESCRIPTION
    const query = `
      SELECT EVENT_ID, TITLE, TO_CHAR(EVENT_DATE, 'YYYY-MM-DD') AS EVENT_DATE, DESCRIPTION 
      FROM CALENDAR_EVENTS ORDER BY EVENT_DATE ASC
    `;
    try {
        const events = await executeQuery(query);
        res.json({ events });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching calendar events' });
    }
});

module.exports = router;
