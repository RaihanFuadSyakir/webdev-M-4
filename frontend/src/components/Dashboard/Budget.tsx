import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Budget, dbResponse } from '@/utils/type';

const BudgetInfo = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
  
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
      const negativeBudgets = budgets.filter((budget) => budget.current_budget < 0).slice(0, 3);
  
      return (
        <div className="w-full max-w-screen-lg mx-auto p-8 overflow-x-auto">
          <div className="flex flex-wrap">
            {negativeBudgets.map((budget) => (
              <div key={budget.id} className="bg-white p-4 m-4 rounded-md shadow-lg min-w-64">
                {/* Tambahkan min-width untuk menjaga ukuran box */}
                <h3 className="text-lg font-semibold">{budget.category.category_name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <div className="bg-red-400 text-white p-2 rounded-md text-sm">
                    <p className="mb-1">Warning!</p>
                    <p className="mb-1">Your outcomes beyond the budget</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-gray-600">Total Budget</p>
                    <p className="text-xl font-bold">${budget.total_budget}</p>
                    <p className="text-gray-600">Current Budget</p>
                    <p className="text-xl font-bold">${budget.current_budget}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
  
    return (
      <div className="bg-white p-4 m-4 rounded-md shadow-lg overflow-x-auto">
        <div className="w-full max-w-screen-lg mx-auto p-8">
          {renderNegativeBudgetInfo()}
        </div>
      </div>
    );
  };
  
  export default BudgetInfo;
  