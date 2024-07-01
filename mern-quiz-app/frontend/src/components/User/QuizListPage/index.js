import { useEffect, useState } from "react";
import Header from "../../Header";
import QuizItem from "../QuizPage"; 
import './index.css';
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Puff } from "react-loader-spinner";

const QuizListPage = () => {
    const [quizList, setQuizList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [isQuizStarted, setIsQuizStarted] = useState(false);

    const navigate = useNavigate(); // Use useNavigate hook here

    const getQuizListFromServer = async () => {
        const QuizListAPI = "http://localhost:5000/api/quizzes/published";
        try {
            const response = await fetch(QuizListAPI);
            if (!response.ok) {
                const {message} = await response.json();
                throw new Error(message);
            }
            const {quizList} = await response.json();
            setQuizList(quizList);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuizListFromServer();
    }, []);

    const handleAttemptNow = (quizId) => {
        setIsQuizStarted(true);
        setSelectedQuizId(quizId);
        navigate(`/quizzes/${quizId}`); // Use navigate function from useNavigate hook
    };

    const handleCancelAttempt = () => {
        setSelectedQuizId(null);
    };

    return (
        <div className="quiz-list-page">
            <Header />
            <div className="content-container">
                <h2 className="welcome-heading">Welcome to the Quizzes Page!</h2>
                {loading && 
                    <Puff
                        visible={true}
                        height="80"
                        width="80"
                        color="#1291e6"
                        ariaLabel="puff-loading"
                    />
                }
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && quizList.length === 0 && <p>No quizzes available.</p>}
                {!isQuizStarted && <ul className="quiz-list">
                    {quizList.map(quizItem => (
                        <li key={quizItem._id} className="quiz-item">
                            <p className="quiz-name">{quizItem.title}</p>
                            <button type="button" className='attemp-now-btn' onClick={() => handleAttemptNow(quizItem._id)}>Attempt Now</button>
                        </li>
                    ))}
                </ul>}
                {selectedQuizId && <QuizItem quizId={selectedQuizId} onCancel={handleCancelAttempt} />}
            </div>
        </div>
    );
};

export default QuizListPage;
