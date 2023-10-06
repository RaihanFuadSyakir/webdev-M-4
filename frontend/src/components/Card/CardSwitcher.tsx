"use client"
// components/CardSwitcher.tsx
import React, { useState } from 'react';
import { Button, ButtonGroup, Paper, Typography } from '@mui/material';

interface CardSwitcherProps {
  cards: string[]; // An array of card names or identifiers
}

const CardSwitcher: React.FC<CardSwitcherProps> = ({ cards }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleCardSwitch = (index: number) => {
    setActiveCardIndex(index);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px', maxWidth: '400px' }}>
      <Typography variant="h5" component="div" gutterBottom>
        Card Switcher
      </Typography>

      <ButtonGroup color="primary" aria-label="outlined primary button group">
        {cards.map((card, index) => (
          <Button
            key={index}
            variant={index === activeCardIndex ? 'contained' : 'outlined'}
            onClick={() => handleCardSwitch(index)}
          >
            {card}
          </Button>
        ))}
      </ButtonGroup>

      <div style={{ marginTop: '20px' }}>
        <Typography variant="body1">Active Card: {cards[activeCardIndex]}</Typography>
        {/* Add more card details or components here */}
      </div>
    </Paper>
  );
};

export default CardSwitcher;

