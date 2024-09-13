import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  // Managing state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here we are sending username and password to the server and checking if the credentials are valid or not
    try {
      const response = await axios.post('/api/login', { username, password });
      
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        login({ username });
        navigate('/game');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            alert('Invalid username or password');
          } else {
            alert('An error occurred during login');
          }
        } else if (error.request) {
          alert('No response from server');
        } else {
          alert('Error during request setup');
        }
      }
  };
// Switching to register form
  const handleSwitchToRegister = () => {
    navigate('/register');
  };
// Displaying the data shown on login form
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
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
          <button type="submit">Login</button>
        </form>
        <div className="switch-form">
          <p>Don't have an account?</p>
          <button onClick={handleSwitchToRegister}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
