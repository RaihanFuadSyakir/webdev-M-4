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
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showAllData, setShowAllData] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/incomes/user`)
      .then((response: AxiosResponse<dbResponse<Income[]>>) => {
        const res: dbResponse<Income[]> = response.data;
        setIncomes(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch incomes:', error);
      });

    axiosInstance
      .get(`${BACKEND_URL}/api/outcomes/`)
      .then((response: AxiosResponse<dbResponse<Outcome[]>>) => {
        const res: dbResponse<Outcome[]> = response.data;
        setOutcomes(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }, []);

  const combinedData: (Income | Outcome)[] = [...incomes, ...outcomes];

  const filteredData = combinedData.filter((item) => {
    const date = new Date(item.date);
    const itemMonth = date.getMonth() + 1;
    const itemYear = date.getFullYear();
    return showAllData || (itemMonth === selectedMonth && itemYear === selectedYear);
  });

  const monthlyData = filteredData.reduce((acc, item) => {
    const date = new Date(item.date);
    const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
    const amount = 'total_income' in item ? item.total_income : item.total_outcome || 0;

    if (!acc[monthYearKey]) {
      acc[monthYearKey] = {
        date: monthYearKey,
        income: 0,
        outcome: 0,
      };
    }

    if ('total_income' in item) {
      acc[monthYearKey].income += amount;
    } else {
      acc[monthYearKey].outcome += amount;
    }

    return acc;
  }, {} as Record<string, { date: string; income: number; outcome: number }>);

  const sortedData = Object.values(monthlyData).sort((a, b) => {
    const [aMonth, aYear] = a.date.split('-');
    const [bMonth, bYear] = b.date.split('-');
    const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1);
    const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1);
    return aDate.getTime() - bDate.getTime();
  });

  const chartOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Cashflow Overview',
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
    <div className="sm:w-full sm:max-w-screen-lg mx-auto p-8 border border-stroke shadow-default rounded-lg">
      <div className="sm:flex mb-4 space-x-4 items-center">
        <div>
            <label className="text-gray-600 text-sm pr-3">Month:</label>
            <select
            className="p-2 text-sm border border-gray-300 rounded-md"
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            value={selectedMonth}
            >
            <option value="0">Show All Data</option>
            {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString('en-US', { month: 'long' })}
                </option>
            ))}
            </select>
        </div>
        <div className='mt-4 sm:mt-0'>
            <label className="text-gray-600 text-sm pr-3">Year:</label>
            <select
            className="p-2 text-sm border border-gray-300 rounded-md"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            value={selectedYear}
            >
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                {year}
                </option>
            ))}
            </select>
        </div>
        <div className='mt-4 sm:mt-0'>
            <label className="text-gray-600 text-sm pr-3">Show All Data:</label>
            <input
                type="checkbox"
                onChange={() => setShowAllData(!showAllData)}
                checked={showAllData}
            />
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default BarChartReport;