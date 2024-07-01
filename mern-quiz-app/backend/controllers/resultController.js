// backend/controllers/resultController.js
const asyncHandler = require('express-async-handler');
const QuizResult = require('../models/quizResultModel');

// @desc    Create a quiz result
// @route   POST /api/results
// @access  Private
const createResult = asyncHandler(async (req, res) => {
  const { quiz, score } = req.body;

  const result = new QuizResult({
    user: req.user._id,
    quiz,
    score,
  });

  const createdResult = await result.save();
  res.status(201).json(createdResult);
});

// @desc    Get results for a user
// @route   GET /api/results
// @access  Private
const getUserResults = asyncHandler(async (req, res) => {
  const results = await QuizResult.find({ user: req.user._id }).populate('quiz', 'title');
  res.json(results);
});

module.exports = { createResult, getUserResults };
