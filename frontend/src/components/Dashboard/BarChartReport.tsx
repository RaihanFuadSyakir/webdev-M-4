"use client"
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { AxiosResponse } from 'axios';
import { Income, Outcome, dbResponse } from '@/utils/type';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarChartReport = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

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

  // Calculate monthly income and outcome based on fetched data
  const monthlyData = incomes
    .concat(outcomes) // Combine incomes and outcomes into a single array
    .reduce((acc, item) => {
      const date = new Date(item.date); // Assuming date is a string in 'YYYY-MM-DD' format
      const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const amount = item.total_income || item.total_outcome; // Assuming there are fields like total_income and total_outcome

      if (!acc[monthYearKey]) {
        acc[monthYearKey] = {
          date: monthYearKey,
          income: 0,
          outcome: 0,
        };
      }

      if (item.total_income) {
        acc[monthYearKey].income += amount;
      } else {
        acc[monthYearKey].outcome += amount;
      }

      return acc;
    }, {});

  // Sort data by date (in this case, month-year)
  const sortedData = Object.values(monthlyData).sort((a, b) => {
    const [aMonth, aYear] = a.date.split('-');
    const [bMonth, bYear] = b.date.split('-');
    return new Date(`${aYear}-${aMonth}`) - new Date(`${bYear}-${bMonth}`);
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
    <div className="w-full max-w-screen-lg mx-auto p-8">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default BarChartReport;