// backend/routes/forum.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET all discussions
router.get('/', async (req, res) => {
    const query = `
        SELECT DISCUSSION_ID, TITLE, CONTENT, TO_CHAR(POSTED_ON, 'YYYY-MM-DD') AS POSTED_ON 
        FROM DISCUSSIONS ORDER BY POSTED_ON DESC
    `;
    try {
        const discussions = await executeQuery(query);
        res.json({ discussions });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching discussions' });
    }
});

// POST a new discussion
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    // In a real app, add user info and use a proper timestamp.
    const query = `
        INSERT INTO DISCUSSIONS (DISCUSSION_ID, TITLE, CONTENT, POSTED_ON) 
        VALUES (DISCUSSION_SEQ.NEXTVAL, :1, :2, SYSDATE)
    `;
    try {
        await executeQuery(query, [title, content]);
        // Optionally, return the newly created discussion.
        res.json({ message: 'Discussion posted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error posting discussion' });
    }
});

// GET discussion detail with replies
router.get('/:id', async (req, res) => {
    const discussionId = req.params.id;
    const discussionQuery = `
        SELECT DISCUSSION_ID, TITLE, CONTENT, TO_CHAR(POSTED_ON, 'YYYY-MM-DD') AS POSTED_ON 
        FROM DISCUSSIONS WHERE DISCUSSION_ID = :1
    `;
    const repliesQuery = `
        SELECT REPLY_ID, CONTENT, TO_CHAR(REPLIED_ON, 'YYYY-MM-DD') AS REPLIED_ON 
        FROM DISCUSSION_REPLIES WHERE DISCUSSION_ID = :1 ORDER BY REPLIED_ON ASC
    `;
    try {
        const discussion = await executeQuery(discussionQuery, [discussionId]);
        const replies = await executeQuery(repliesQuery, [discussionId]);
        if (discussion && discussion.length > 0) {
            res.json({ discussion: discussion[0], replies });
        } else {
            res.status(404).json({ error: 'Discussion not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error fetching discussion details' });
    }
});

module.exports = router;
