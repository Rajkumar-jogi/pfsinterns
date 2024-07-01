const { Schema, model } = require('mongoose');

// Define the option schema
const optionSchema = Schema({
    option: {
        type: String,
        required: true,
    }
});

// Define the question schema
const questionSchema = Schema({
    question: {
        type: String,
        required: true,
    },
    options: [optionSchema],
    answer: {
        type: String,
        required: true
    }
});

// Define the quiz schema
const quizSchema = Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: { 
        type: String,
    },
    questions: [questionSchema],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (assuming your user model is named 'User')
        required: true
    },
    published: {
        type: Boolean,
        default: true
    }
});

const Quiz = model('Quiz', quizSchema);

module.exports = Quiz;
