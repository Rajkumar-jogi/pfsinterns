import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Puff } from 'react-loader-spinner';
import Cookies from 'js-cookie';
import AdminHeader from '../AdminHeader';
import './index.css';

const AdminQuizView = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const token = Cookies.get('token');

    const fetchQuiz = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch quizzes');
            }
            const data = await response.json();
            console.log(data)
            setQuiz(data);
        } catch (error) {
            console.error(error);
            setError('There is no quiz created yet.');
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    const renderQuizDetails = () => (
        <div>
            <h2>Title: {quiz.title}</h2>
            <p>Description: {quiz.description}</p>
            <ul>
                { quiz.questions.map((question, qIndex) => (
                    <li key={qIndex} className="question-container">
                        <div className="question">{question.question}</div>
                        <ul className="option-list">
                            {question.options.map((option, oIndex) => (
                                <li key={oIndex} className="option">
                                    <input type="radio" name={`question-${qIndex}`} value={option.option} disabled />
                                    {option.option}
                                </li>
                            ))}
                        </ul>
                        <div className="answer">Answer: {question.answer}</div>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="home-main">
            <AdminHeader />
            <div className="content-container">
                {loading || quiz.questions === undefined ? 
                <div className='loader-container'>
                   <Puff color='#37acf0' height={80} width={80} />
                </div> : renderQuizDetails()}
            </div>
            {error && <p>{error}</p>}
        </div>
    );
};

export default AdminQuizView;
