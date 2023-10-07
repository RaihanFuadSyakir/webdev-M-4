"use client"
// components/CardSwitcher.tsx
import React, { useState } from 'react';

interface CardSwitcherProps {
  cards: string[]; // An array of card names or identifiers
}

const CardSwitcher: React.FC<CardSwitcherProps> = ({ cards }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const nextCard = () => {
    setActiveCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setActiveCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  return (
    <div className="flex justify-center items-center my-4">
      <button onClick={prevCard} className="mr-4">
        &lt; Prev
      </button>
      <div className="card-container">
        <div className="card" style={{ opacity: activeCardIndex === 0 ? 1 : 0 }}>
        <div className="space-y-16">
            <div className="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
            
                <img className="relative object-cover w-full h-full rounded-xl" src="https://i.imgur.com/kGkSg1v.png" />
                                
                <div className="w-full px-8 absolute top-8">
                    <div className="flex justify-between">
                        <div className="">
                            <h1 className="font-light">
                                Name
                            </h1>
                            <p className="font-medium tracking-widest">
                                Karthik P
                            </p>
                        </div>
                        <img className="w-14 h-14" src="https://i.imgur.com/bbPHJVe.png"/>
                    </div>
                    <div className="pt-1">
                        <h1 className="font-light">
                            Card Number
                        </h1>
                        <p className="font-medium tracking-more-wider">
                            4642  3489  9867  7632
                        </p>
                    </div>
                    <div className="pt-6 pr-6">
                        <div className="flex justify-between">
                            <div className="">
                                <h1 className="font-light text-xs">
                                    Valid
                                </h1>
                                <p className="font-medium tracking-wider text-sm">
                                    11/15
                                </p>
                            </div>
                            <div className="">
                                <h1 className="font-light text-xs text-xs">
                                    Expiry
                                </h1>
                                <p className="font-medium tracking-wider text-sm">
                                    03/25
                                </p>
                            </div>
    
                            <div className="">
                                <h1 className="font-light text-xs">
                                    CVV
                                </h1>
                                <p className="font-bold tracking-more-wider text-sm">
                                    ···
                                </p>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
        </div>
        <div className="card" style={{ opacity: activeCardIndex === 1 ? 1 : 0 }}>
          <h3 className="text-center">{cards[1]}</h3>
        </div>
        <div className="card" style={{ opacity: activeCardIndex === 2 ? 1 : 0 }}>
          <h3 className="text-center">{cards[2]}</h3>
        </div>
      </div>
      <button onClick={nextCard} className="ml-4">
        Next &gt;
      </button>
    </div>
    </div>
  );
};

export default CardSwitcher;
