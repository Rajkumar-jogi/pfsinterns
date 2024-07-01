
import React from 'react';
import Popup from 'reactjs-popup';

const QuizCreationPopup = ({ isOpen, onClose, onSubmit, quiz, onInputChange, onQuestionChange, onOptionChange, onAddQuestion, onRemoveQuestion }) => {
    return (
        <Popup contentStyle={{ width: '90%', 'maxWidth': "1200px", 'backgroundColor': "transparent" }} open={isOpen} modal onClose={onClose}>
            <div className="custom-modal">
                <button className="close" onClick={onClose}>&times;</button>
                <div className="header"> Create New Quiz </div>
                <div className="content">
                    <form onSubmit={onSubmit}>
                        <div className='form-block'>
                            <div className='quiz-block'>
                                <label>Title</label>
                                <input className='title-input' type='text' name='title' value={quiz.title} onChange={onInputChange} required />
                            </div>
                            <div className='quiz-block'>
                                <label>Description</label>
                                <textarea className='description-input' rows={5} cols={55} name='description' value={quiz.description} onChange={onInputChange} required />
                            </div>
                        </div>
                        <div className='form-block'>
                            {quiz.questions.map((question, qIndex) => (
                                <div key={qIndex} className="question-block">
                                    <label>Question</label>
                                    <input className='question-input' type='text' name='question' value={question.question} onChange={(e) => onQuestionChange(qIndex, e)} required />
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex}>
                                            <label>Option {oIndex + 1}</label>
                                            <input className='option-input' type='text' value={option.option} onChange={(e) => onOptionChange(qIndex, oIndex, e)} required />
                                        </div>
                                    ))}
                                    <label>Answer</label>
                                    <input className='answer-input' type='text' name='answer' value={question.answer} onChange={(e) => onQuestionChange(qIndex, e)} required />
                                </div>
                            ))}
                        </div>
                        <button type="button" className="button" onClick={onAddQuestion}>Create Another Question</button>
                        <button type="button" className="button" onClick={onRemoveQuestion}>Remove Question</button>
                        <button type="submit" className="button">Save</button>
                    </form>
                </div>
            </div>
        </Popup>
    );
};

export default QuizCreationPopup;
