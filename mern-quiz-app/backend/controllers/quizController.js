const mongoose = require('mongoose')

const Quiz = require('../models/quizModel');

// // Validate questions
function validateQuestions(questions) {
    const questionSet = new Set();

    console.log('questionset before loop:', questionSet)

    for (let eachQuestion of questions) {
        // Check for missing fields in each question
        if (!eachQuestion.question || !eachQuestion.options || eachQuestion.options.length !== 4 || !eachQuestion.answer) {
            return { isValid: false, message: 'Each question must have a question name, exactly four options, and an answer.' };
        }

        // Check for duplicate questions within the same quiz
        if (questionSet.has(eachQuestion.question)) {
            return { isValid: false, message: `Duplicate question: "${eachQuestion.question}". Each question must be unique within the same quiz.` };
        }
        questionSet.add(eachQuestion.question);

        // Validate options
        const optionSet = new Set();
        for (let eachOptObj of eachQuestion.options) {
             const {option} = eachOptObj
             console.log('option: ', option)
            if (typeof option !== 'string' || option.trim() === '') {
                return { isValid: false, message: 'Options must be non-empty strings.' };
            }
            if (optionSet.has(option)) {
                return { isValid: false, message: `Duplicate options found in question: "${eachQuestion.question}". Each option must be unique.` };
            }
            optionSet.add(option);
        }
    }

    return { isValid: true };
}


// Create quiz 
const createQuiz = async (req, res) => {
    try {
        console.log('data at create quiz fun: ', req.body.questions)
        const { title, description, questions } = req.body;

        // Check for missing fields
        if (!title || !description || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'Please provide all the quiz details including at least one question.' });
        }

        // Validate questions
        const validation = validateQuestions(questions);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        console.log('user in quizController: ', req.user)

        // Create new quiz
        const newQuiz = new Quiz({
            title,
            description,
            questions,
            createdBy: req.user.id // Assuming you are using protect middleware to set req.user
        });

        // Save created quiz in database
        await newQuiz.save();
        return res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all quizzes for admins
const getQuizzesForAdmins = async (req, res) => {
    try {
        // Fetch quizzes created by the logged-in admin
        const quizzes = await Quiz.find({ createdBy: req.user.id }).populate('createdBy', 'username email'); 
        return res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// publish quiz by id

const publishQuiz = async (req, res) => {
    try{
        const { id } = req.params;
     
        const updates = req.body
        
        // Validate the id is a valid ObjectId
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(404).json({message: 'invalid quiz id'})
        }

        const foundQuiz = await Quiz.findOne({_id: id})

        console.log("found quiz in publish method: ", foundQuiz)

        if(!foundQuiz){
            res.status(404).json({message: 'quiz is not found'})
        }

        const publishedQuiz = await Quiz.findOneAndUpdate(
            { _id: id, createdBy: req.user.id },
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('createdBy', 'username email')
        return res.status(200).json({ message: 'Quiz updated successfully', quiz: publishedQuiz });

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get quiz by ID for admins
const getQuizByIdForAdmins = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id: ', id)
        console.log('user: ', req.user)
        const quiz = await Quiz.findOne({ _id: id, createdBy: req.user.id }).populate('createdBy', 'username email');
        console.log('quiz in admin: ', quiz)
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        return res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update quiz by ID
const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, questions } = req.body;

        // Validate the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid quiz id' });
        }

        // Find the quiz by id to check if it exists
        const foundQuiz = await Quiz.findOne({ _id: id });

        if (!foundQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Validate questions if provided
        if (questions) {
            const validation = validateQuestions(questions);
            if (!validation.isValid) {
                return res.status(400).json({ message: validation.message });
            }
        }

        // Update the quiz
        const updatedQuiz = await Quiz.findOneAndUpdate(
            { _id: id, createdBy: req.user.id }, // ensure only the creator can update
            { title, description, questions },
            { new: true, runValidators: true }
        ).populate('createdBy', 'username email');

        console.log('updatedQuiz: ', updatedQuiz)

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found or user not authorized' });
        }

        return res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete quiz by ID
const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuiz = await Quiz.findOneAndDelete({ _id: id, createdBy: req.user.id });

        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        return res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// get published quizzess
const getPublishedQuizzes = async (req, res) => {
    try{
        const quizzes = await Quiz.find({published: true})
        if(!quizzes || quizzes.length === 0){
            res.status(404).json({message: "There is no published quizzess right now check after some time.."})
        }else{
            res.status(200).json({quizList: quizzes})
        }
    }
    catch(e){
        console.log(e)
    }
}

// Get published quiz by id
const getPublishedQuizById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid quiz id' });
        }

        const quiz = await Quiz.findOne({_id: id, published: true })
        console.log('quiz in published: ', quiz)

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        return res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createQuiz, getPublishedQuizById, getPublishedQuizzes, getQuizzesForAdmins, getQuizByIdForAdmins, updateQuiz, deleteQuiz, publishQuiz };
