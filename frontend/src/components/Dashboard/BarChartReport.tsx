"use client"
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { AxiosResponse } from 'axios';
import { Income, Outcome, dbResponse } from '@/utils/type';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface MonthlyData {
  [key: string]: {
    date: string;
    income: number;
    outcome: number;
  };
}
const BarChartReport = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [combine_inout,setinout] = useState<Income[]|Outcome[]>([]);
  useEffect(() => {
    // Fetch incomes
    axiosInstance
      .get(`/incomes/user`)  // Replace with your actual endpoint for incomes
      .then((response: AxiosResponse<dbResponse<Income[]>>) => {
        const res: dbResponse<Income[]> = response.data;
        setIncomes(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch incomes:', error);
      });

    // Fetch outcomes
    axiosInstance
      .get(`${BACKEND_URL}/api/outcomes/`) // Replace with your actual endpoint for outcomes
      .then((response: AxiosResponse<dbResponse<Outcome[]>>) => {
        const res: dbResponse<Outcome[]> = response.data;
        setOutcomes(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }, []);

  // Assuming incomes and outcomes are arrays of objects with a 'date' property
const monthlyData: MonthlyData = [...incomes, ...outcomes]
.reduce((acc: MonthlyData, item) => {
  const date = new Date(item.date); // Assuming date is a string in 'YYYY-MM-DD' format
  const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
  let amount = 0;

  

  if (!acc[monthYearKey]) {
    acc[monthYearKey] = {
      date: monthYearKey,
      income: 0,
      outcome: 0,
    };
  }
  if (typeof item === 'object' && 'total_income' in item) {
    acc[monthYearKey].income = item.total_income;
  } else if (typeof item === 'object' && 'total_outcome' in item) {
    acc[monthYearKey].outcome = item.total_outcome; // Assuming there are fields like total_income and total_outcome
  }

  return acc; // Don't forget to return the updated acc
}, {});

  // Sort data by date (in this case, month-year)
// Sort data by date (in this case, month-year)
const sortedData = Object.values(monthlyData).sort((a, b) => {
  const [aMonth, aYear] = a.date.split('-').map(Number);
  const [bMonth, bYear] = b.date.split('-').map(Number);
  const dateA = new Date(`${aYear}-${aMonth}`);
  const dateB = new Date(`${bYear}-${bMonth}`);
  return (dateA as any) - (dateB as any); // Explicitly cast to any and then to number
});

  const chartOptions = {
    chart: {
      type: 'column', // Column chart
      width: 800,
      height: 400,
    },
    title: {
      text: 'Monthly Cashflow Overview',
    },
    xAxis: {
      categories: sortedData.map((entry) => entry.date),
      title: {
        text: 'Month-Year',
      },
    },
    yAxis: {
      title: {
        text: 'Amount',
      },
    },
    series: [
      {
        name: 'Income',
        data: sortedData.map((entry) => entry.income),
      },
      {
        name: 'Outcome',
        data: sortedData.map((entry) => entry.outcome),
      },
    ],
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-8 border border-stroke shadow-default rounded-lg">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default BarChartReport;