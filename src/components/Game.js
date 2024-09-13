import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Confetti from 'react-confetti';
import api from '../api';
import './Game.css';

// These are the values shown on the cards
const generateDeck = () => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  const deck = [...values, ...values].map((value) => ({
    value,
    isFlipped: false,
    id: Math.random(),
  }));
  return deck.sort(() => Math.random() - 0.5);
};

const Game = () => {
  // Used to handle state
  const [deck, setDeck] = useState(generateDeck());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [pastScores, setPastScores] = useState([]);
  const [isNearingHighScore, setIsNearingHighScore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchHighScore(); // Fetch high score when the component mounts
      fetchPastScores(); // Fetch past scores when the component mounts
    }
  }, [navigate]);

  // Fetching high score
  const fetchHighScore = async () => {
    try {
      const response = await api.get('/highscore');
      setHighScore(response.data.highScore);
    } catch (error) {
      console.error('Error fetching high score:', error);
    }
  };

  // Fetching past scores
  const fetchPastScores = async () => {
    try {
      const response = await api.get('/scores');
      // Removing duplicate scores
      const uniqueScores = Array.from(
        new Map(response.data.map(score => [score.date, score])).values()
      );
      setPastScores(uniqueScores.slice(0, 10)); // Showing latest unique scores
    } catch (error) {
      console.error('Error fetching past scores:', error);
    }
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = deck[firstIndex];
      const secondCard = deck[secondIndex];

      // If the cards match increase the score
      if (firstCard.value === secondCard.value) {
        setMatchedPairs((prev) => [...prev, firstCard.value]);
        setScore((prevScore) => prevScore + 1);
        setDeck((prevDeck) =>
          prevDeck.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, isFlipped: true }
              : card
          )
        );
        
        // If the score is more than high score show the confetti
        if (score + 1 > highScore) {
          setHighScore(score + 1);
          setShowConfetti(true);
          setAlertTitle('New High Score!');
          setAlertMessage(`Congratulations! New High Score: ${score + 1}`);
          setShowAlert(true);
          setIsNearingHighScore(false);
          // If we are nearby the high score we will show this animation (Bonus task)
        } else if (highScore - (score + 1) <= 1) {
          setIsNearingHighScore(true);
          setTimeout(() => setIsNearingHighScore(false), 5000);
        }
        
        // Game over alert box when we solve all the pairs
        if(score + 1 === 15) {
          setShowConfetti(true);
          setAlertTitle('Game Over');
          setAlertMessage('Congratulations! You won!');
          setShowAlert(true);
        }
      } else {
        setTimeout(() => {
          setDeck((prevDeck) =>
            prevDeck.map((card, index) =>
              index === firstIndex || index === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 800);
      }

      setFlippedIndices([]);
    }
  }, [flippedIndices, deck, matchedPairs, score, highScore]);

  // It is used to flip the card and check if the card is matched keep the state else go back to its original state
  const handleCardClick = (card) => {
    const index = deck.findIndex((c) => c.id === card.id);
    if (flippedIndices.length < 2 && !deck[index].isFlipped && !matchedPairs.includes(deck[index].value)) {
      setDeck((prevDeck) =>
        prevDeck.map((c, i) => (i === index ? { ...c, isFlipped: true } : c))
      );
      setFlippedIndices((prev) => [...prev, index]);
    }
  };

  // It is used to reset the score and flip the card to its original position
  const handleReset = () => {
    setDeck(generateDeck());
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0);
    setShowConfetti(false);
    setIsNearingHighScore(false);

    // Update the past scores with the final score if the score is greater than 0
    if (score > 0) {
      submitScore(score);
    }
    fetchPastScores(); 
  };

  const handleLogout = async () => {
    // When the click the logout button and update the past scores with the final score only if the score is greater than 0
    if (score > 0) {
      try {
        await submitScore(score);
      } catch (error) {
        console.error('Error submitting score during logout:', error);
      }
    }
    // Remove the token and navigate to login
    localStorage.removeItem('token');
    navigate('/');
  };

  // Alert box closing button handler
  const handleCloseAlert = () => {
    setShowAlert(false);
    setShowConfetti(false);
  };

  // Used to fetch the latest score
  const submitScore = async (newScore) => {
    try {
      await api.post('/score', { score: newScore });
      fetchPastScores();
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  // It is used to format the time that is shown next to past score
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Return the data to display it on the screen
  return (
    <div className="game">
      <div className="game-left">
        {showConfetti && <Confetti />}
        <h1>Memory Game</h1>
        <div className="card-grid">
          {deck.map((card) => (
            <Card key={card.id} card={card} onClick={handleCardClick} />
          ))}
        </div>
      </div>
      <div className="game-right">
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleReset}>Reset Game</button>
        <div className={`score ${isNearingHighScore ? 'nearing-high-score' : ''}`}>Score: {score}</div>
        <div className={`high-score ${isNearingHighScore ? 'nearing-high-score' : ''}`}>High Score: {highScore}</div>
        <div className="past-scores">
          <h2>Past Scores</h2>
          {pastScores.length > 0 ? (
            <ul>
              {pastScores.map((pastScore, index) => (
                <li key={index}>Score: {pastScore.score} - ({formatDateTime(pastScore.date)})</li>
              ))}
            </ul>
          ) : (
            <p>No past scores are present.</p>
          )}
        </div>
        {showAlert && (
          <div className="alert-modal">
            <div className="alert-content">
              <div className="alert-title">{alertTitle}</div>
              <div className="alert-message">{alertMessage}</div>
              <button className="alert-close-button" onClick={handleCloseAlert}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
