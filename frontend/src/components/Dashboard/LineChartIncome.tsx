"use client"

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { ZodError } from 'zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Income, Outcome, Wallet, dbResponse } from '@/utils/type';
import WalletSelect from '@/components/wallet/WalletSelect';
import { currencySchema } from '@/utils/validation';
import InputAdornment from '@mui/material/InputAdornment';
import CategorySelect from '@/components/category/CategorySelect';
import ListIncomes from '@/components/income/ListIncome';
import Breadcrumb from '@/components/template/Breadcrumbs/Breadcrumb';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChartIncome = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [nominal, setNominal] = useState(0);
  const [description, setDescription] = useState('');
  const [wallet, setWallet] = useState(0);
  const [date, setDate] = useState(''); // Add date state
  const [nominalError, setNominalError] = useState('');
  const [walletError, setWalletError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Fetch Incomes data when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`/incomes/user`) // Replace with your actual endpoint
      .then((response: AxiosResponse<dbResponse<Income[]>>) => {
        const res: dbResponse<Income[]> = response.data;
        setIncomes(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch incomes:', error);
      });
  }, []);
  
  // Mengubah timestamp menjadi tanggal saja (misal: 2023-10-17 00:00:00 -> 17)
  const formatTimestampToDay = (timestamp) => {
    const date = new Date(timestamp);
    return date.getDate(); // Mengambil tanggal dari timestamp
  };

  // Fungsi untuk mengelompokkan data outcome berdasarkan tanggal
  const groupIncomesByDate = (incomes: Income[]) => {
    return incomes.reduce((result: { [key: string]: number }, income: Income) => {
      const date = income.date; // Ambil tanggal dari outcome
      const totalIncome = income.total_income;

      // Jika tanggal sudah ada di result, tambahkan totalOutcome
      if (result[date]) {
        result[date] += totalIncome;
      } else {
        // Jika tanggal belum ada di result, tambahkan tanggal dengan totalOutcome
        result[date] = totalIncome;
      }

      return result;
    }, {});
  };

  // Mengelompokkan data outcome perhari dan mengubah label sumbu x ke tanggal
  const groupedIncomes = groupIncomesByDate(incomes);

  // Mengubah hasil pengelompokkan ke format yang bisa digunakan oleh chartOptions
  const chartData = Object.keys(groupedIncomes).map(date => ({
    date: formatTimestampToDay(date), // Mengubah label sumbu x ke tanggal
    total_income: groupedIncomes[date],
  })).sort((a, b) => a.date - b.date); // Urutkan berdasarkan tanggal

  const chartOptions = {
    title: {
      text: 'Income Data Visualization'
    },
    xAxis: {
      categories: chartData.map(item => item.date), // Menggunakan chartData yang sudah dielompokkan
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Total Income'
      }
    },
    series: [{
      name: 'Total Income',
      data: chartData.map(item => item.total_income), // Menggunakan chartData yang sudah dielompokkan
      type: 'line',
      width: 800,
      height: 400
    }]
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-8">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default LineChartIncome;
