"use client"
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosResponse } from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Wallet, dbResponse } from '@/utils/type';

const PieChartWallet = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    // Fetch wallets data when the component mounts
    axiosInstance
      .get(`/wallet/user`) // Replace with your actual endpoint
      .then((response: AxiosResponse<dbResponse<Wallet[]>>) => {
        const res: dbResponse<Wallet[]> = response.data;
        // Process and set wallets data
        setWallets(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch wallets:', error);
      });
  }, []);

  // Calculate total balance
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.total_balance, 0);

  // Prepare data for the pie chart with percentages and labels
  const chartData = wallets.map((wallet) => ({
    name: `${wallet.wallet_name} (${((wallet.total_balance / totalBalance) * 100).toFixed(2)}%)`, // Include percentage in the label
    y: wallet.total_balance,
  }));

  const chartOptions = {
    title: {
      text: 'Wallet Balances',
    },
    series: [{
      type: 'pie',
      data: chartData,
    }],
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-8">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default PieChartWallet;
