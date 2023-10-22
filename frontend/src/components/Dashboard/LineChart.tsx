"use client"

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Outcome, Wallet, dbResponse } from '@/utils/type';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = () => {
  const [nominal, setNominal] = useState(0);
  const [category, setCategory] = useState(0);
  const [description, setDescription] = useState('');
  const [wallet, setWallet] = useState(0);
  const [date, setDate] = useState(''); // Add date state
  const [nominalError, setNominalError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [walletError, setWalletError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outcomes,setOutcomes] = useState<Outcome[]>([]);
   // Fetch outcomes data when the component mounts
   useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/outcomes/`)
      .then((response: AxiosResponse<dbResponse<Outcome[]>>) => {
        const res: dbResponse<Outcome[]> = response.data;
        // Filter outcomes for the current month (assuming date field is in 'YYYY-MM-DD' format)
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const filteredOutcomes = res.data.filter((outcome) => {
          const outcomeDate = new Date(outcome.date);
          const outcomeMonth = outcomeDate.getMonth() + 1;
          const outcomeYear = outcomeDate.getFullYear();
          return outcomeMonth === currentMonth && outcomeYear === currentYear;
        });
        setOutcomes(filteredOutcomes);
      })
      .catch((error) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }, []);

  // Mengubah timestamp menjadi tanggal saja (misal: 2023-10-17 00:00:00 -> 17)
  const formatTimestampToDay = (timestamp) => {
    const date = new Date(timestamp);
    return date.getDate(); // Mengambil tanggal dari timestamp
  };

  // Fungsi untuk mengelompokkan data outcome berdasarkan tanggal
  const groupOutcomesByDate = (outcomes: Outcome[]) => {
    return outcomes.reduce((result: { [key: string]: number }, outcome: Outcome) => {
      const date = outcome.date; // Ambil tanggal dari outcome
      const totalOutcome = outcome.total_outcome;

      // Jika tanggal sudah ada di result, tambahkan totalOutcome
      if (result[date]) {
        result[date] += totalOutcome;
      } else {
        // Jika tanggal belum ada di result, tambahkan tanggal dengan totalOutcome
        result[date] = totalOutcome;
      }

      return result;
    }, {});
  };

  // Mengelompokkan data outcome perhari dan mengubah label sumbu x ke tanggal
  const groupedOutcomes = groupOutcomesByDate(outcomes);

  // Mengubah hasil pengelompokkan ke format yang bisa digunakan oleh chartOptions
  const chartData = Object.keys(groupedOutcomes).map(date => ({
    date: formatTimestampToDay(date), // Mengubah label sumbu x ke tanggal
    total_outcome: groupedOutcomes[date],
  })).sort((a, b) => a.date - b.date); // Urutkan berdasarkan tanggal

  const chartOptions = {
    title: {
      text: 'Outcome This Month'
    },
    xAxis: {
      categories: chartData.map(item => item.date), // Menggunakan chartData yang sudah dielompokkan
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Total Outcome'
      }
    },
    series: [{
      name: 'Total Outcome',
      data: chartData.map(item => item.total_outcome), // Menggunakan chartData yang sudah dielompokkan
      type: 'line',
      width: 800,
      height: 400
    }]
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-8 border border-stroke shadow-default rounded-lg">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default LineChart;