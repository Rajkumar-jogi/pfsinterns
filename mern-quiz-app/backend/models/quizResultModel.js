// backend/models/quizResultModel.js
const mongoose = require('mongoose');

const quizResultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Quiz',
    },
    score: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
