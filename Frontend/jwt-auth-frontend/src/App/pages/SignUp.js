// src/pages/SignUp.js
import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);  // Show loading indicator

        

        try {
            // Prepare user data for registration
            const userData = {
                firstName,
                lastName,
                username,
                email,
                password,
                userType: 2,  // Default userType as 2 (since it's not displayed on the UI)
            };

            // Make API call to register the user
            const response = await api.post('/user/register', userData);

            // Redirect user to login page after successful registration
            alert('Registration successful! Please login to continue.');
            navigate('/login'); // Redirect to login page
        } catch (err) {
            setError('Failed to register. Please try again.');
        } finally {
            setLoading(false);  // Hide loading indicator
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Sign Up for Cred</h2>
                <form onSubmit={handleSignUp}>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        className="login-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Login here</span></p>
            </div>
        </div>
    );
};

export default SignUp;
