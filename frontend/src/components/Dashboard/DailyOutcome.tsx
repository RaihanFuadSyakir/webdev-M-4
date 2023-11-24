"use client"

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Outcome, dbResponse } from '@/utils/type';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = () => {
  const [allOutcomes, setAllOutcomes] = useState<Outcome[]>([]);
  const [filteredOutcomes, setFilteredOutcomes] = useState<Outcome[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1); // Set default to current month
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear()); // Set default to current year

  useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/outcomes/`)
      .then((response: AxiosResponse<dbResponse<Outcome[]>>) => {
        const res: dbResponse<Outcome[]> = response.data;
        setAllOutcomes(res.data);
      })
      .catch((error: AxiosError) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }, []);

  useEffect(() => {
    // Filter outcomes based on selectedMonth and selectedYear
    const filtered = allOutcomes.filter((outcome) => {
      if (selectedMonth !== null && selectedYear !== null) {
        const outcomeDate = new Date(outcome.date);
        const outcomeMonth = outcomeDate.getMonth(); // Zero-indexed month
        const outcomeYear = outcomeDate.getFullYear();
        return outcomeMonth === selectedMonth - 1 && outcomeYear === selectedYear;
      }
      return true; // No filter applied if month or year is not selected
    });

    setFilteredOutcomes(filtered);
  }, [selectedMonth, selectedYear, allOutcomes]);

  const formatTimestampToDay = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return date.getDate();
  };

  const groupOutcomesByDate = (outcomes: Outcome[]) => {
    return outcomes.reduce((result: { [key: string]: number }, outcome: Outcome) => {
      const date = outcome.date;
      const totalOutcome = outcome.total_outcome;

      if (result[date]) {
        result[date] += totalOutcome;
      } else {
        result[date] = totalOutcome;
      }

      return result;
    }, {});
  };

  const groupedOutcomes = groupOutcomesByDate(filteredOutcomes);

  const chartData = Object.keys(groupedOutcomes).map((date) => ({
    date: formatTimestampToDay(date),
    total_outcome: groupedOutcomes[date],
  })).sort((a, b) => a.date - b.date);

  const chartOptions = {
    title: {
      text: 'Daily Outcome',
    },
    xAxis: {
      categories: chartData.map((item) => item.date),
      title: {
        text: 'Date',
      },
    },
    yAxis: {
      title: {
        text: 'Total Outcome',
      },
    },
    series: [{
      name: 'Total Outcome',
      data: chartData.map((item) => item.total_outcome),
      type: 'line',
    }],
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-8 border border-stroke shadow-default rounded-lg">
      <div className="mb-4 sm:flex space-x-4 items-center">
        <div>
            <label className="text-gray-600 text-sm pr-3" htmlFor="month">Month:</label>
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
        </div>
        <div className='mt-4 sm:mt-0'>
            <label className="text-gray-600 text-sm pr-3" htmlFor="year">Year:</label>
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
      </div>
      </div>

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default LineChart;
