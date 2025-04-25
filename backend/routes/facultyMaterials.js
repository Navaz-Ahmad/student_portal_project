const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET: Fetch study materials for a given subject.
router.get('/', async (req, res) => {
  const subject = req.query.subject;
  console.log("FacultyMaterials GET request for subject:", subject);
  
  if (!subject) {
    return res.status(400).json({ error: 'Subject required' });
  }
  
  const query = `
    SELECT 
      MATERIAL_ID,
      TITLE,
      SUBJECT,
      FILE_URL,
      UPLOADED_BY,
      TO_CHAR(UPLOAD_DATE, 'YYYY-MM-DD') AS UPLOAD_DATE
    FROM STUDY_MATERIALS
    WHERE SUBJECT = :1
    ORDER BY UPLOAD_DATE DESC
  `;
  
  try {
    const rows = await executeQuery(query, [subject]);
    if (!rows || rows.length === 0) {
      return res.json({ materials: [] });
    }
    const materials = rows.map(row => ({
      materialId: row[0],
      title: row[1],
      subject: row[2],
      materialLink: row[3], // We'll map FILE_URL to materialLink for frontend consistency.
      uploadedBy: row[4],
      uploadDate: row[5]
    }));
    console.log("Transformed Materials Data Retrieved:", materials);
    res.json({ materials });
  } catch (err) {
    console.error("Error fetching study materials:", err);
    res.status(500).json({ error: 'Error fetching study materials', details: err.message });
  }
});

// POST: Upload a new study material using a provided material link.
router.post('/upload', async (req, res) => {
  const { title, subject, uploadedBy, materialLink } = req.body;
  if (!title || !subject || !uploadedBy || !materialLink) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const query = `
    INSERT INTO STUDY_MATERIALS (MATERIAL_ID, TITLE, SUBJECT, FILE_URL, UPLOADED_BY, UPLOAD_DATE)
    VALUES (study_materials_seq.NEXTVAL, :1, :2, :3, :4, SYSDATE)
  `;
  
  try {
    await executeQuery(query, [title, subject, materialLink, uploadedBy], { autoCommit: true });
    console.log(`Study material uploaded for subject ${subject} by faculty ${uploadedBy}`);
    res.json({ message: 'Study material uploaded successfully' });
  } catch (err) {
    console.error("Error uploading study material:", err);
    res.status(500).json({ error: 'Error uploading study material', details: err.message });
  }
});

module.exports = router;
