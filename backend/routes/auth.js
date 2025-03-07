// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// Signup endpoint
router.post('/signup', async (req, res, next) => {
    const { name, email, password, subject,brancj } = req.body;
    const query = `INSERT INTO STUDENTS (STUDENT_ID, NAME, EMAIL, PASSWORD, SUBJECT, BRANCH) 
                   VALUES (STUDENT_SEQ.NEXTVAL, :1, :2, :3, :4, :5, :6)`;
    try {
        const result = await executeQuery(query, [name, email, password, subject, branch]);
        if (result === null) {
            return res.status(500).json({ error: 'Database error during signup' });
        }
        res.json({ message: 'Signup Successful! Please login.' });
    } catch (err) {
        next(err);
    }
});

// Login endpoint
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const query = "SELECT STUDENT_ID, NAME, EMAIL, BRANCH FROM STUDENTS WHERE EMAIL = :1 AND PASSWORD = :2";
    try {
        const result = await executeQuery(query, [email, password]);
        if (result && result.length > 0) {
            const user = {
                id: result[0][0],
                name: result[0][1],
                email: result[0][2],
                branch: result[0][3]
            };
            req.session.user = user;
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid Email/Password' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
