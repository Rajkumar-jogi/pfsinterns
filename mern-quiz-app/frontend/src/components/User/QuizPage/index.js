import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { Puff } from 'react-loader-spinner';
import './index.css';
import Header from "../../Header";

const QuizInstructions = ({ onCancel, handleContinue, quiz }) => (
    <div className="instructions-container">
        <button type="button" className="cross-btn" onClick={onCancel}>X</button>
        <h2 className="quiz-title">{quiz.title}</h2>
        <p className="quiz-description">{quiz.description}</p>
        <div className="button-group">
            <button onClick={handleContinue} className="continue-button">Continue</button>
            <button onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
    </div>
);

const ResultContainer = ({ onCancel, result }) => (
    <div className="result-container">
        <h2>Quiz Result</h2>
        <p>{result}</p>
        <button onClick={onCancel} className="exit-button">Close</button>
    </div>
);

const ExitContainer = ({ handleExit }) => (
    <div className="exit-container">
        <h2>Quiz Completed</h2>
        <p>Are you sure you want to exit the quiz and see the result?</p>
        <button onClick={handleExit} className="exit-button">Exit</button>
    </div>
);

const QuizContainer = ({ quiz, handleNextQuestion, currentQuestionIndex, setSelectedOptions, handlePreviousQuestion }) => (
    <div className="quiz-container">
        <h2 className="quiz-title">{quiz.title}</h2>
        {quiz.questions.length > 0 ? (
            <div className="question-block">
                <h3 className="quiz-question">{quiz.questions[currentQuestionIndex].question}</h3>
                <ul className="options-list">
                    {quiz.questions[currentQuestionIndex].options.map((option) => (
                        <li key={option._id} className="option">
                            <input
                                className="option-radio-input"
                                type="radio"
                                name='option'
                                value={option.option}
                                onChange={(e) => setSelectedOptions(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }))}
                            />
                            <label className="option-label">
                                {option.option}
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="navigation-buttons">
                    <button onClick={handlePreviousQuestion} className="nav-button" disabled={currentQuestionIndex === 0}>
                        Previous
                    </button>
                    <button onClick={handleNextQuestion} className="nav-button">
                        {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
                    </button>
                </div>
            </div>
        ) : (
            <p>No questions available.</p>
        )}
    </div>
);

const QuizItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    console.log('id: ', id)
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInstructions, setShowInstructions] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/quizzes/${id}/published`);
                if (!response.ok) {
                    throw new Error("Failed to fetch quiz");
                }
                const fetchedData = await response.json();
                console.log('fetchedData: ', fetchedData)
                setQuiz(fetchedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    const handleContinue = () => {
        setShowInstructions(false);
    };

    const handleCancel = () => {
        navigate('/quizzes'); 
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowExitPopup(true);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleExit = () => {
        setShowExitPopup(false);
        setShowResult(true);
    };

    const calculateResult = () => {
        let correctAnswers = 0;

        quiz.questions.forEach((question, index) => {
            if (question.answer === selectedOptions[index]) {
                correctAnswers += 1;
            }
        });

        return `${correctAnswers} out of ${quiz.questions.length} correct`;
    };

    const Loader = () => (
        <div className="loading-container">
            <Puff
                color="#00BFFF"
                height={100}
                width={100}
            />
        </div>
    );


    return (
        <div className="quiz-page">
            <Header />
            <div className="content-container">
                {error && <p>{error}</p>}
                {loading ? <Loader /> : (
                   <Popup
                      contentStyle={{
                          width: "90%",
                          maxWidth: "800px",
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          padding: "20px"
                      }}
                      open
                    >
                      {showInstructions ? (
                          <QuizInstructions
                              onCancel={handleCancel}
                              handleContinue={handleContinue}
                              quiz={quiz}
                          />
                      ) : showResult ? (
                          <ResultContainer
                              onCancel={handleCancel}
                              result={calculateResult()}
                          />
                      ) : showExitPopup ? (
                          <ExitContainer handleExit={handleExit} />
                      ) : (
                          <QuizContainer
                              quiz={quiz}
                              handleNextQuestion={handleNextQuestion}
                              handlePreviousQuestion={handlePreviousQuestion}
                              setSelectedOptions={setSelectedOptions}
                              currentQuestionIndex={currentQuestionIndex}
                          />
                      )}
                   </Popup>
                )}
            </div>
        </div>
    );
};

export default QuizItem;
