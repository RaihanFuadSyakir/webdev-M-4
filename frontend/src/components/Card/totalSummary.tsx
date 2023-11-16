import { Income, Outcome } from '@/utils/type';
import React from 'react';

interface TotalFinancialProps {
  totalIncome: Income[];
  totalOutcome: Outcome[];
}

const TotalFinancial: React.FC<TotalFinancialProps> = ({ totalIncome, totalOutcome }) => {
  const calculateTotal = (items: any[], key: string) => {
    return items.reduce((total, item) => total + item[key], 0);
  };

  const totalIncomeAmount = calculateTotal(totalIncome, 'total_income');
  const totalOutcomeAmount = calculateTotal(totalOutcome, 'total_outcome');
  const totalSavings = totalIncomeAmount - totalOutcomeAmount;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  let message = '';
  let messageColor = '';

  if (totalIncomeAmount > totalOutcomeAmount) {
    message = 'You have savings!';
    messageColor = 'bg-green-500';
  } else if (totalIncomeAmount < totalOutcomeAmount) {
    message = 'Spending exceeds income.';
    messageColor = 'bg-red-500';
  } else {
    message = 'Income equals outcome.';
    messageColor = 'bg-blue-500';
  }

  return (
    <div className="grid grid-cols-3 gap-4 mt-3">
      <div className="w-54 h-36 bg-green-400 rounded-lg shadow-md p-4">
        <div className="mb-12 text-white text-lg font-bold">Total Income</div>
        <div className="flex flex-row-reverse text-2xl font-bold text-white">{formatRupiah(totalIncomeAmount)}</div>
      </div>

      <div className="w-54 h-36 bg-red-400 rounded-lg shadow-md p-4">
        <div className="mb-12 text-white text-lg font-bold">Total Outcome</div>
        <div className="flex flex-row-reverse text-2xl font-bold text-white">{formatRupiah(totalOutcomeAmount)}</div>
      </div>

      <div className="w-54 h-36 bg-blue-400 rounded-lg shadow-md p-4">
        <div className="mb-12 text-white text-lg font-bold">Total Savings</div>
        <div className="flex flex-row-reverse text-2xl font-bold text-white">{formatRupiah(totalSavings)}</div>
      </div>

      <div className={`mr-5 py-1 rounded-lg col-span-3 mt-4 text-l font-bold text-white text-center ${messageColor}`}>
        {message}
      </div>
    </div>
  );
};

export default TotalFinancial;
