"use client";

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Outcome, dbResponse } from '@/utils/type';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarChart = () => {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [filteredOutcomes, setFilteredOutcomes] = useState<Outcome[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
  const [showAllData, setShowAllData] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/outcomes/`)
      .then((response: AxiosResponse<dbResponse<Outcome[]>>) => {
        const res: dbResponse<Outcome[]> = response.data;
        setOutcomes(res.data);
      })
      .catch((error: AxiosError) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }, []);

  useEffect(() => {
    if (showAllData) {
      const sortedOutcomes = [...outcomes].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      setFilteredOutcomes(sortedOutcomes);
    } else {
      const filtered = outcomes.filter((outcome) => {
        if (selectedMonth !== null && selectedYear !== null) {
          const outcomeDate = new Date(outcome.date);
          const outcomeMonth = outcomeDate.getMonth() + 1;
          const outcomeYear = outcomeDate.getFullYear();
          return outcomeMonth === selectedMonth && outcomeYear === selectedYear;
        }
        return true;
      });

      setFilteredOutcomes(filtered);
    }
  }, [selectedMonth, selectedYear, outcomes, showAllData]);

  const formatTimestampToMonthYear = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const groupOutcomesByMonthAndCategory = (outcomes: Outcome[]) => {
    return outcomes.reduce((result: { [key: string]: { [key: string]: number } }, outcome: Outcome) => {
      const monthYearKey = formatTimestampToMonthYear(outcome.date);
      const category = outcome.category?.category_name || 'Uncategorized';
      const totalOutcome = outcome.total_outcome;

      if (!result[monthYearKey]) {
        result[monthYearKey] = {};
      }

      if (result[monthYearKey][category]) {
        result[monthYearKey][category] += totalOutcome;
      } else {
        result[monthYearKey][category] = totalOutcome;
      }

      return result;
    }, {});
  };

  const groupedOutcomesByMonthAndCategory = groupOutcomesByMonthAndCategory(filteredOutcomes);

  const months = Object.keys(groupedOutcomesByMonthAndCategory).sort((a, b) => {
    const aDate = new Date(`${a}-01`);
    const bDate = new Date(`${b}-01`);
    return aDate.getTime() - bDate.getTime();
  });

  const categories = Array.from(
    new Set(outcomes.map((outcome) => outcome.category?.category_name || 'Uncategorized'))
  );

  const chartData = categories.map((category) => ({
    name: category,
    data: months.map((month) => groupedOutcomesByMonthAndCategory[month][category] || 0),
  }));

  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  const chartOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Monthly Category-wise Outcome',
    },
    xAxis: {
      categories: months.map(month => monthNames[parseInt(month.split('-')[0], 10) - 1]),
      title: {
        text: 'Month',
      },
    },
    yAxis: {
      title: {
        text: 'Total Outcome',
      },
    },
    series: chartData,
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-8 border border-stroke shadow-default rounded-lg">
      <div className="mb-4 space-x-4 items-center">
        <label className="text-gray-600 text-sm" htmlFor="month">
          Month:
        </label>
        <select
          className="p-2 text-sm border border-gray-300 rounded-md"
          id="month"
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          value={selectedMonth || ''}
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>

        <label className="text-gray-600 text-sm" htmlFor="year">
          Year:
        </label>
        <select
          className="p-2 text-sm border border-gray-300 rounded-md"
          id="year"
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          value={selectedYear || ''}
        >
          <option value="">Select Year</option>
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label className="text-gray-600 text-sm" htmlFor="showAllData">
          Show All Data:
        </label>
        <input
          type="checkbox"
          id="showAllData"
          onChange={() => setShowAllData(!showAllData)}
          checked={showAllData}
        />
      </div>

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default BarChart;
