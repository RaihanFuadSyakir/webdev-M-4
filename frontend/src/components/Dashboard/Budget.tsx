import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Budget, dbResponse } from '@/utils/type';

const BudgetInfo = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

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
    const filteredBudgets = budgets.filter((budget) => {
      const budgetDate = new Date(budget.year, budget.month - 1); // Months are zero-indexed in JavaScript
      return budgetDate.getMonth() + 1 === selectedMonth && budgetDate.getFullYear() === selectedYear && budget.current_budget < 0;
    });

    return (
      <div className="w-full max-w-screen-lg mx-auto p-8 border border-stroke shadow-default rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Overspending Alerts</h1>
        {/* Add a dropdown or input fields to select month and year */}
        <div className="mb-4 space-x-4 items-center">
          <label className="text-gray-600 text-sm">Select Month:</label>
          <select
            className="p-2 text-sm border border-gray-300 rounded-md"
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            value={selectedMonth}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <label className="text-gray-600 text-sm">Select Year:</label>
          <input
            type="number"
            className="p-2 text-sm border border-gray-300 rounded-md"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            value={selectedYear}
          />
        </div>
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex space-x-4">
            {filteredBudgets.map((budget) => (
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
