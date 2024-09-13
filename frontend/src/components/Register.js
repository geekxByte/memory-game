import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sign_In_Up.css';

function Register() {
  // Managing state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
// Registering new user and redirecting to login page also checking the user already exists or not
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', { username, password });
      if (response.status === 201) {
        alert('Registration successful. Please log in.');
        navigate('/login');
      } else if (response.status === 400) {
        alert('Registration failed. Username already exists.');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Registration failed. Username already exists.');
      } else {
        console.error('Error during registration:', error);
        alert('An error occurred during registration');
      }
    }
  };
// Switching to login form
  const handleSwitchToLogin = () => {
    navigate('/login');
  };
// Displaying the data shown on register form
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className="switch-form">
          <p>Already have an account?</p>
          <button onClick={handleSwitchToLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
