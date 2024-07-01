const express = require('express');
const { createQuiz, getPublishedQuizzes, getPublishedQuizById, getQuizzesForAdmins,getQuizByIdForAdmins, updateQuiz, deleteQuiz, publishQuiz } = require('../controllers/quizController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// routes for public

router.get('/published', getPublishedQuizzes)
router.get('/:id/published', getPublishedQuizById)

// routes for authenticated user
router.post('/create', protect, createQuiz);
router.get('/', protect, getQuizzesForAdmins);
router.get('/:id', protect, getQuizByIdForAdmins);
router.put('/update/:id', protect, updateQuiz);
router.delete('/delete/:id', protect, deleteQuiz);
router.patch('/:id/publish', protect, publishQuiz)




module.exports = router;
