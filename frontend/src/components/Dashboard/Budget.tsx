import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Budget, dbResponse } from '@/utils/type';

const BudgetInfo = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/budgets/`)
      .then((response: AxiosResponse<dbResponse<Budget[]>>) => {
        const res: dbResponse<Budget[]> = response.data;
        setBudgets(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch budgets:', error);
      });
  }, []);

  const renderNegativeBudgetInfo = () => {
    const negativeBudgets = budgets.filter((budget) => budget.current_budget < 0);

    return (
      <div className="w-full max-w-screen-lg mx-auto p-8 border border-stroke shadow-default rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Overspending Alerts</h1>
        {/* Add the button to toggle the message */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowMessage(!showMessage)}
        >
          {showMessage ? 'Hide Info' : 'Show Info'}
        </button>
        {/* Conditionally render the message based on the state */}
        {showMessage && (
          <p className="text-center mt-4 text-gray-600">
            This overspending alerts is blablabla
          </p>
        )}
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex space-x-4">
            {negativeBudgets.map((budget) => (
              <div key={budget.id} className="bg-white p-4 m-4 rounded-md shadow-lg min-w-64 flex-shrink-0">
                <h3 className="text-lg font-semibold">Category: {budget.category.category_name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <div className="bg-red-400 text-white p-2 rounded-md text-sm">
                    <p className="mb-1">Warning!</p>
                    <p className="mb-1">Your outcomes exceed the budget by Rp.{budget.current_budget.toLocaleString()}.</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-gray-600">Total Budget</p>
                    <p className="text-xl font-bold">Rp.{budget.total_budget.toLocaleString()}</p>
                    <p className="text-gray-600">Current Budget</p>
                    <p className="text-xl font-bold">Rp.{budget.current_budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderNegativeBudgetInfo()}
    </div>
  );
};

export default BudgetInfo;
