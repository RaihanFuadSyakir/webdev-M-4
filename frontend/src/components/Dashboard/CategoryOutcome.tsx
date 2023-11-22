"use client"

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Outcome, dbResponse } from '@/utils/type';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarChart = () => {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  useEffect(() => {
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

  const groupedOutcomesByMonthAndCategory = groupOutcomesByMonthAndCategory(outcomes);

  const months = Object.keys(groupedOutcomesByMonthAndCategory).sort(); // Sorting months

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
      text: 'Outcome per Category per Month',
    },
    xAxis: {
      categories: months.map(month => monthNames[parseInt(month.split('-')[0], 10) - 1]), // Mapping to month names
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
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default BarChart;
