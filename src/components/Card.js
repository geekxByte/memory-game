import React from 'react';
import './Card.css';

//This component renders a single card and manage how card will be displayed
const Card = ({ card, onClick }) => {
  return (
    <div
      className={`card ${card.isFlipped ? 'flipped' : ''}`}
      onClick={() => onClick(card)}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{card.value}</div>
      </div>
    </div>
  );
};

export default Card;
