import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import './index.css'

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            }
            const loginAPI = 'http://localhost:5000/api/users/login'
            const response = await fetch(loginAPI, options );

            const data = await response.json();
            console.log(response)
            console.log(data)

            if (response.ok) {
                Cookies.set('token', data.token, { expires: 7 });
                navigate("/dashboard")
                
            } else {
                setError(data.message || 'An error occurred');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
            <form onSubmit={submitHandler}>
                <h2 className='login-heading'>Login As Teacher/Creater</h2>
                <div className='form-field'>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)} />
                       
                </div>
                <div className='form-field'>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className='submit-button' type="submit">Login</button>
                {error && <p>{error}</p>}
                {loading && <p>Loading...</p>}
            </form>
    );
};


export default LoginForm