// backend/routes/assignments.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

router.get('/', async (req, res) => {
    const query = "SELECT ASSIGNMENT_ID, TITLE, DESCRIPTION, DUE_DATE, SUBJECT FROM ASSIGNMENTS";
    try {
        const assignments = await executeQuery(query);
        res.json({ assignments });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching assignments' });
    }
});

module.exports = router;
