"use client"

// components/CardSwitcher.tsx
import React, { useState } from 'react';
import styles from '@/components/Card/CardSwither.module.css';  // Import the CSS

interface CardSwitcherProps {
  cards: string[]; // An array of card names or identifiers
}

const CardSwitcher: React.FC<CardSwitcherProps> = ({ cards }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleCardSwitch = (index: number) => {
    setActiveCardIndex(index);
  };

  return (
    <div>
      <div className="card-switcher-buttons">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleCardSwitch(index)}
            className={index === activeCardIndex ? 'active' : ''}
          >
            {card}
          </button>
        ))}
      </div>

      <div className="active-card-info">
        <h3>Active Card: {cards[activeCardIndex]}</h3>
        {/* Add more card details or components here */}
      </div>
    </div>
  );
};

export default CardSwitcher;
