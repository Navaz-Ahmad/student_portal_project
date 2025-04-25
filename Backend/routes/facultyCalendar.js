const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET: Fetch all calendar events
router.get('/', async (req, res) => {
  const query = `
    SELECT EVENT_ID, TITLE, TO_CHAR(EVENT_DATE, 'YYYY-MM-DD') AS EVENT_DATE, DESCRIPTION 
    FROM CALENDAR_EVENTS 
    ORDER BY EVENT_DATE ASC
  `;
  try {
    const rows = await executeQuery(query);
    if (!rows || rows.length === 0) {
      return res.json({ events: [] });
    }
    const events = rows.map(row => ({
      eventId: row[0],
      title: row[1],
      eventDate: row[2],
      description: row[3]
    }));
    console.log("Transformed Calendar Events:", events);
    res.json({ events });
  } catch (err) {
    console.error("Error fetching calendar events:", err);
    res.status(500).json({ error: 'Error fetching calendar events', details: err.message });
  }
});

// POST: Upload a new calendar event
// Requires title and eventDate; description is optional.
router.post('/upload', async (req, res) => {
  const { title, eventDate, description } = req.body;
  console.log("Faculty Calendar POST request:", { title, eventDate, description });
  
  if (!title || !eventDate) {
    return res.status(400).json({ error: 'Title and event date are required' });
  }
  
  // Ensure you have created a sequence in your database:
  // CREATE SEQUENCE calendar_events_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
  const query = `
    INSERT INTO CALENDAR_EVENTS (EVENT_ID, TITLE, EVENT_DATE, DESCRIPTION)
    VALUES (calendar_events_seq.NEXTVAL, :1, TO_DATE(:2, 'YYYY-MM-DD'), :3)
  `;
  
  try {
    await executeQuery(query, [title, eventDate, description]);
    res.json({ message: 'Event uploaded successfully' });
  } catch (err) {
    console.error("Error uploading calendar event:", err);
    res.status(500).json({ error: 'Error uploading event', details: err.message });
  }
});

module.exports = router;
