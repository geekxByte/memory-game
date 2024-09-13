import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Home.css';

function Home() {
  // Managing state
  const [highScores, setHighScores] = useState([]);

  // Fetching high scores using api.js
  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const response = await api.get('/topscores');
        setHighScores(response.data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching high scores:', error);
      }
    };

    fetchHighScores();
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to the Memory Game</h1>
        <p>
          Test your memory skills with our exciting memory game. Match pairs of cards and
          keep track of your high scores!
        </p>
        {/* We are using Link from react-router-dom to go to login page */}
        <div className="home-buttons">
          <Link to="/login">
            <button className="home-button">Login</button>
          </Link>
          {/* We are using Link from react-router-dom to go to register page */}
          <Link to="/register">
            <button className="home-button">Sign Up</button>
          </Link>
        </div>
        {/* Here we are displaying the top 5 scores of the users (Bonus task) */}
        <div className="high-scores">
          <h2>Top 10 High Scores</h2>
          {highScores.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {highScores.map((score, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{score.username}</td>
                    <td>{score.highScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No high scores available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;