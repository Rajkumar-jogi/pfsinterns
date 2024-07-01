import React, { useState } from 'react';

import {useNavigate} from 'react-router-dom'

import cookies from 'js-cookie'

const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const renderCreateQuizPage = (token) => {
         cookies.set("token", token, {expires: 1})
         // Navigate to the admin dashboard route
         navigate('/dashboard');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try{

            const singUpAPI = 'http://localhost:5000/api/users/register'

            const userDetails = {name, email, password}
            
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userDetails)
            }

            const response = await fetch(singUpAPI, options)
            const data = await response.json()
            console.log(response)
            console.log(data)
            if(response.ok){
               renderCreateQuizPage(data.token)
            }else{
                setError(data.message)
            }

        }catch(e){
            console.log(e)
        }finally{
            setLoading(false)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up As Teacher/Creator</h2>
            <div className="form-field">
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-field">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-field">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <p className='error-msg'>{error}</p>
            <button className='submit-button' type="submit">Sign Up</button>
            {loading && <p>loading....</p>}
        </form>
    );
};

export default SignupForm;
