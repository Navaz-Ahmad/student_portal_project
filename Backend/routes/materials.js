// backend/routes/materials.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

router.get('/', async (req, res) => {
    const query = `
        SELECT MATERIAL_ID, TITLE, SUBJECT, FILE_URL, TO_CHAR(UPLOAD_DATE, 'YYYY-MM-DD') AS UPLOAD_DATE 
        FROM STUDY_MATERIALS
    `;
    try {
        const materials = await executeQuery(query);
        res.json({ materials });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching study materials' });
    }
});

module.exports = router;
