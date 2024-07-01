
import { useState } from "react";

import LoginForm from "../LoginForm";

import SignupForm from "../SignupForm";

import './index.css'

const CredentialScreen = () => {
    const [showLoginForm, setShowLoginForm] = useState(true);

    const toggleForm = () => {
        setShowLoginForm(!showLoginForm);
    };

    return (
        <div className="main">
            <div className="form-container">
                {showLoginForm ? <LoginForm /> : <SignupForm />}
            </div>
            <div>
                <p>{showLoginForm ? "Don't have account Create an account" : 'Already have an account?'}</p>
                <button type="button" className="toggle-button" onClick={toggleForm}>
                    {showLoginForm ? 'Signup Here' : 'Login Here'}
                </button>
            </div>
        </div>
    );
};

export default CredentialScreen