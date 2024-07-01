import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminHeader from "../AdminHeader";
import Cookies from 'js-cookie';
import CreateQuizPopup from '../CreateQuizPopup';
import UpdateQuizPopup from '../UpdateQuizPopup'; 

import { MdDeleteForever } from "react-icons/md";

import { FaArrowCircleRight } from "react-icons/fa";

import './index.css';

const AdminDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false); // State for update popup
    const [selectedQuiz, setSelectedQuiz] = useState(null); // State for the quiz being updated
    const [error, setError] = useState(null);
    const [newQuiz, setNewQuiz] = useState({ title: '', description: '', questions: [{ question: '', options: [{ option: '' }, { option: '' }, { option: '' }, { option: '' }], answer: '' }] });
    const token = Cookies.get('token');

    const navigate = useNavigate()

    const fetchQuizzes = useCallback(async () => {
        try {
            console.log('Token for fetchQuizzes:', token);
            const response = await fetch('http://localhost:5000/api/quizzes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch quizzes');
            }
            const data = await response.json();
            setQuizzes(data);
        } catch (error) {
            console.error(error);
            setError('There is no quiz created yet.');
        }
    }, [token]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleCreateQuiz = async (quiz) => {
        try {
            const response = await fetch('http://localhost:5000/api/quizzes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(quiz),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Response Error:', errorData);
                throw new Error('Failed to create quiz');
            }
            fetchQuizzes();
            setIsPopupOpen(false);
        } catch (error) {
            console.error('Request Error:', error);
            setError('Failed to create quiz. Please check your input and try again.');
        }
    };

    const handleUpdateQuiz = async (quiz) => {
        console.log(quiz)
        try {
            const response = await fetch(`http://localhost:5000/api/quizzes/update/${quiz._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(quiz),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Response Error:', errorData);
                throw new Error('Failed to update quiz');
            }
            fetchQuizzes();
            setIsUpdatePopupOpen(false);
        } catch (error) {
            console.error('Request Error:', error);
            setError('Failed to update quiz. Please check your input and try again.');
        }
    };

    const handleDeleteQuiz = async (quiz) => {
           
           try{
                  const deleteApiUrl = `http://localhost:5000/api/quizzes/delete/${quiz._id}`
                  const options = {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                  }

                  const response = await fetch(deleteApiUrl, options)
                  const msg = await response.json()
                  
                  if(response.ok){
                      alert(msg.message)
                      fetchQuizzes()
                  }
                  else{
                    throw new Error('failed to delete quiz')
                  }
           }catch(e){
               console.log(e)
           }
    }

    const onClickCreateQuiz = () => {
        setIsPopupOpen(true);
    };

    const onClickUpdateQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setIsUpdatePopupOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (isUpdatePopupOpen) {
            setSelectedQuiz({ ...selectedQuiz, [name]: value });
        } else {
            setNewQuiz({ ...newQuiz, [name]: value });
        }
    };

    const handleQuestionChange = (index, event) => {
        const { name, value } = event.target;
        if (isUpdatePopupOpen) {
            const updatedQuestions = selectedQuiz.questions.map((question, qIndex) =>
                qIndex === index ? { ...question, [name]: value } : question
            );
            setSelectedQuiz({ ...selectedQuiz, questions: updatedQuestions });
        } else {
            const updatedQuestions = newQuiz.questions.map((question, qIndex) =>
                qIndex === index ? { ...question, [name]: value } : question
            );
            setNewQuiz({ ...newQuiz, questions: updatedQuestions });
        }
    };

    const handleOptionChange = (qIndex, oIndex, event) => {
        const { value } = event.target;
        if (isUpdatePopupOpen) {
            const updatedQuestions = selectedQuiz.questions.map((question, questionIndex) =>
                questionIndex === qIndex ? {
                    ...question,
                    options: question.options.map((option, optionIndex) =>
                        optionIndex === oIndex ? { option: value } : option
                    )
                } : question
            );
            setSelectedQuiz({ ...selectedQuiz, questions: updatedQuestions });
        } else {
            const updatedQuestions = newQuiz.questions.map((question, questionIndex) =>
                questionIndex === qIndex ? {
                    ...question,
                    options: question.options.map((option, optionIndex) =>
                        optionIndex === oIndex ? { option: value } : option
                    )
                } : question
            );
            setNewQuiz({ ...newQuiz, questions: updatedQuestions });
        }
    };

    const handleAddQuestion = () => {
        if (isUpdatePopupOpen) {
            setSelectedQuiz({
                ...selectedQuiz,
                questions: [...selectedQuiz.questions, { question: '', options: [{ option: '' }, { option: '' }, { option: '' }, { option: '' }], answer: '' }]
            });
        } else {
            setNewQuiz({
                ...newQuiz,
                questions: [...newQuiz.questions, { question: '', options: [{ option: '' }, { option: '' }, { option: '' }, { option: '' }], answer: '' }]
            });
        }
    };

    const handleRemoveQuestion = () => {
        if (isUpdatePopupOpen) {
            setSelectedQuiz({
                ...selectedQuiz,
                questions: selectedQuiz.questions.slice(0, -1)
            });
        } else {
            setNewQuiz({
                ...newQuiz,
                questions: newQuiz.questions.slice(0, -1)
            });
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (isUpdatePopupOpen) {
            handleUpdateQuiz(selectedQuiz);
        } else {
            handleCreateQuiz(newQuiz);
        }
    };

    const onClickDelele = (quiz) => {
        handleDeleteQuiz(quiz)
    }

    const renderQuizItem = (quiz) => {
        const { title, questions, description, _id } = quiz;

        return (
            <li className='admin-quiz-item' key={_id}>
                <div className='title-view-container'>
                    <h3>{title}</h3>
                    <button className='delete-button' onClick={() => onClickDelele(quiz)}>
                        <MdDeleteForever size={30} />
                    </button>
                </div>
                
                <p><strong>Number of questions: </strong><span>{questions.length}</span></p>
                <p><strong>Description: </strong>{description}</p>
                <div className='quiz-btns-container'>
                    <button onClick={() => onClickUpdateQuiz(quiz)}>Update</button>
                    <button className='view-btn' onClick={() => navigate(`/dashboard/${quiz._id}`)}><FaArrowCircleRight size={26} /></button>
                </div>
                
            </li>
        );
    };

    return (
        <div className='admin-main'>
            <AdminHeader />
            <div className="admin-content">
                <h1>Quiz Dashboard</h1>
                {error && <p className="error-message">{error}</p>}
                <button className='button' onClick={onClickCreateQuiz}>Create Quiz</button>
                <CreateQuizPopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onSubmit={handleFormSubmit}
                    quiz={newQuiz}
                    onInputChange={handleInputChange}
                    onQuestionChange={handleQuestionChange}
                    onOptionChange={handleOptionChange}
                    onAddQuestion={handleAddQuestion}
                    onRemoveQuestion={handleRemoveQuestion}
                    error={error}
                />
                {selectedQuiz && (
                    <UpdateQuizPopup
                        isOpen={isUpdatePopupOpen}
                        onClose={() => setIsUpdatePopupOpen(false)}
                        onSubmit={handleFormSubmit}
                        quiz={selectedQuiz}
                        onInputChange={handleInputChange}
                        onQuestionChange={handleQuestionChange}
                        onOptionChange={handleOptionChange}
                        onAddQuestion={handleAddQuestion}
                        onRemoveQuestion={handleRemoveQuestion}
                        error={error}
                    />
                )}
                <ul className='admin-quiz-list'>
                    {quizzes.length > 0 ? quizzes.map(quiz => renderQuizItem(quiz)) : <li>No quizzes available</li>}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
