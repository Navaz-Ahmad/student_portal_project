const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// Check authentication
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});
// Faculty Login
router.post('/login/faculty', async (req, res, next) => {
  const { email, password } = req.body;
  // Modify the query to include a subject mapping
  const query = `
    SELECT FACULTY_ID, NAME, EMAIL, DEPARTMENT, JOIN_DATE,
      CASE FACULTY_ID
        WHEN 'F001' THEN 'Mathematics'
        WHEN 'F002' THEN 'Physics'
        WHEN 'F003' THEN 'Chemistry'
        WHEN 'F004' THEN 'Biology'
        WHEN 'F005' THEN 'English'
        WHEN 'F006' THEN 'History'
        WHEN 'F007' THEN 'Geography'
        WHEN 'F008' THEN 'Computer Science'
        WHEN 'F009' THEN 'Economics'
        WHEN 'F010' THEN 'Business Studies'
        WHEN 'F011' THEN 'Political Science'
        WHEN 'F012' THEN 'Sociology'
        WHEN 'F013' THEN 'Psychology'
        WHEN 'F014' THEN 'Philosophy'
        WHEN 'F015' THEN 'Art'
        WHEN 'F016' THEN 'Music'
        WHEN 'F017' THEN 'Drama'
        WHEN 'F018' THEN 'Physical Education'
        WHEN 'F019' THEN 'Environmental Science'
        WHEN 'F020' THEN 'Literature'
        ELSE 'Mathematics'
      END AS SUBJECT
    FROM FACULTY
    WHERE EMAIL = :1 AND PASSWORD = :2
  `;
  
  try {
      const result = await executeQuery(query, [email, password]);
      if (result && result.length > 0) {
          const user = {
              id: result[0][0],
              name: result[0][1],
              email: result[0][2],
              department: result[0][3],
              joinDate: result[0][4],
              subject: result[0][5], // now subject is included
              role: "faculty"
          };

          req.session.regenerate((err) => {
            if (err) return next(err);
            req.session.user = user;
            req.session.save(() => {
                res.json({ message: 'Faculty login successful', user });
            });
          });
      } else {
          res.status(401).json({ error: 'Invalid Email/Password' });
      }
  } catch (err) {
      next(err);
  }
});

// Student Login
router.post('/login/student', async (req, res, next) => {
    console.log("Login attempt for student:", req.body);  // 🔴 Debugging log

    const { email, password } = req.body;
    const query = "SELECT STUDENT_ID, NAME, EMAIL, BRANCH FROM STUDENTS WHERE EMAIL = :1 AND PASSWORD = :2";

    try {
        const result = await executeQuery(query, [email, password]);
        console.log("Query result:", result); // 🔴 Debugging log

        if (result && result.length > 0) {
            const user = {
                id: result[0][0],
                name: result[0][1],
                email: result[0][2],
                branch: result[0][3],
                role: "student"
            };

            req.session.regenerate((err) => {
                if (err) return next(err);
                req.session.user = user;
                req.session.save(() => {
                    console.log("User session saved:", req.session.user); // 🔴 Debugging log
                    res.json({ message: 'Student login successful', user });
                });
            });
        } else {
            console.log("Invalid login attempt"); // 🔴 Debugging log
            res.status(401).json({ error: 'Invalid Email/Password' });
        }
    } catch (err) {
        next(err);
    }
});


router.post('/forgot-password', async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    // Get student record based on email
    const studentQuery = "SELECT STUDENT_ID FROM STUDENTS WHERE EMAIL = :1";
    const studentResult = await executeQuery(studentQuery, [email]);
    if (!studentResult || studentResult.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const studentId = studentResult[0][0];

    // Get security questions for the student
    const questionsQuery = "SELECT QUESTION FROM SECURITY_QUESTIONS WHERE STUDENT_ID = :1";
    const questionsResult = await executeQuery(questionsQuery, [studentId]);
    if (!questionsResult || questionsResult.length === 0) {
      return res.status(404).json({ error: 'No security questions found for this student' });
    }
    // Map results to an array of questions
    const questions = questionsResult.map(row => row[0]);

    return res.json({ questions });
  } catch (err) {
    next(err);
  }
});
// routes/auth.js

// Reset Password: Verify answers and update password
router.post('/reset-password', async (req, res, next) => {
  const { email, answers, newPassword } = req.body;
  if (!email || !answers || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Get student record based on email
    const studentQuery = "SELECT STUDENT_ID FROM STUDENTS WHERE EMAIL = :1";
    const studentResult = await executeQuery(studentQuery, [email]);
    if (!studentResult || studentResult.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const studentId = studentResult[0][0];

    // Fetch stored security questions and answers for the student
    const storedQuery = "SELECT QUESTION, ANSWER FROM SECURITY_QUESTIONS WHERE STUDENT_ID = :1";
    const storedResult = await executeQuery(storedQuery, [studentId]);
    if (!storedResult || storedResult.length === 0) {
      return res.status(404).json({ error: 'No security questions found for this student' });
    }
    // Verify each answer. Here we assume the order of questions is maintained.
    let allCorrect = true;
    storedResult.forEach((row, index) => {
      const storedAnswer = row[1];
      const providedAnswer = answers[index];
      if (!providedAnswer || providedAnswer.trim().toLowerCase() !== storedAnswer.trim().toLowerCase()) {
        allCorrect = false;
      }
    });

    if (!allCorrect) {
      return res.status(401).json({ error: 'Security answers do not match' });
    }

    // Update the student's password
    const updateQuery = "UPDATE STUDENTS SET PASSWORD = :1 WHERE STUDENT_ID = :2";
    await executeQuery(updateQuery, [newPassword, studentId]);

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// Student Signup
router.post('/signup', async (req, res, next) => {
    const { studentId, name, email, password, year_of_study, branch } = req.body;
    const query = `INSERT INTO STUDENTS (STUDENT_ID, NAME, EMAIL, PASSWORD, YEAR_OF_STUDY, BRANCH) 
                   VALUES (:1, :2, :3, :4, :5, :6)`;

    try {
        const result = await executeQuery(query, [studentId, name, email, password, year_of_study, branch]);
        if (result === null) {
            return res.status(500).json({ error: 'Database error during signup' });
        }
        res.json({ message: 'Signup Successful! Please login.' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
