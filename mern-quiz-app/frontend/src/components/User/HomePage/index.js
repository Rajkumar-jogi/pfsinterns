// HomeScreen.js

import React from 'react';

import {useNavigate} from 'react-router-dom'

import Header from '../../Header';
import './index.css';

const HomePage = (props) => {
 const navigate = useNavigate()

  const onClickCheckNow = () => {
    navigate("/quizzes")
  }

  return (
    <div className="home-main">
      <Header />
      <div className="content-container">
        <h2 className="welcome-heading">Welcome to the Quiz App!</h2>
        <p>Want to test your skill then attempt available quizzes..</p>
        <button className="check-btn" onClick={onClickCheckNow}>
            
                Check Now
            
        </button>
      </div>
    </div>
  );
};

export default HomePage;
