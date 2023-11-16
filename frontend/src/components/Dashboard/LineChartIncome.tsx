"use client"

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Budget, dbResponse } from '@/utils/type';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BudgetChart = () => {
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

  // Mengelompokkan data budget berdasarkan kategori
  const groupBudgetsByCategory = (budgets: Budget[]) => {
    return budgets.reduce((result: { [key: string]: Budget }, budget: Budget) => {
      const categoryID = budget.category_id;
      result[categoryID] = budget;
      return result;
    }, {});
  };

  const groupedBudgets = groupBudgetsByCategory(budgets);

  // Mengubah hasil pengelompokkan ke format yang bisa digunakan oleh chartOptions
  const chartData = Object.keys(groupedBudgets).map(categoryID => {
    const budget = groupedBudgets[categoryID];
    return {
      category: budget.category.category_name,
      totalBudget: budget.total_budget,
      currentBudget: budget.current_budget,
    };
  });

  const chartOptions = {
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Monthly Budget Overview',
    },
    xAxis: {
      categories: chartData.map(item => item.category),
      title: {
        text: 'Category',
      },
    },
    yAxis: {
      title: {
        text: 'Amount',
      },
    },
    series: [
      {
        name: 'Total Budget',
        data: chartData.map(item => item.totalBudget),
        color: 'lightblue',
      },
      {
        name: 'Current Budget',
        data: chartData.map(item => item.currentBudget),
        color: 'lightgreen',
      },
    ],
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-8 border border-stroke shadow-default rounded-lg">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default BudgetChart;