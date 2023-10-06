"use client"

// components/BudgetSelect.tsx
import React, { useState } from 'react';
import Modal from './BudgetModal'; // Create a Modal component (explained later)

const BudgetSelect: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateBudget = () => {
    // Implement your logic for creating a budget
    console.log('Budget created!');
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal} className="bg-primary-500 hover:bg-primary-700 text-black font-bold py-2 px-4 rounded">
        Create Budget
      </button>

      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <div className="px-4 py-5 bg-white sm:p-6">
            <h1 className="text-lg">Create Budget</h1>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
              <input type="date" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Month Selector:</label>
              {/* Add your month selector input here */}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Total Budget:</label>
              <input type="number" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
              <textarea rows={4} className="resize-y border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <button onClick={handleCreateBudget} className="mt-5 bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BudgetSelect;
