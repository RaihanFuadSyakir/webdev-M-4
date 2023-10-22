"use client"
import LineChart from '@/components/Dashboard/LineChart';
import LineChartIncome from '@/components/Dashboard/LineChartIncome';
import BarChartReport from '@/components/Dashboard/BarChartReport';
import axiosInstance from '@/utils/fetchData';
import { User, dbResponse } from '@/utils/type';
import { AxiosResponse } from 'axios';
// No code changes needed. Run `npm install axios @types/axios` in the terminal to install required packages.
import { useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState } from 'react';
import PieChartWallet from '@/components/Dashboard/PieChartWallet';

export default function Dashboard() {
  const [activeButton, setActiveButton] = useState('all');
  const [selectedChart, setSelectedChart] = useState('all');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLinkClick = (chart: SetStateAction<string>) => {
    setSelectedChart(chart);
    setActiveButton(chart);
  };

  useEffect(() => {
    axiosInstance.get('/users/personal')
      .then((response: AxiosResponse<dbResponse<User>>) => {
        setUsername(response.data.data.username);
      })
      .catch((error) => {
        console.log(error);
        router.push('/login');
      });
  }, []);

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'all':
        return (
          <>
            <div className="p-2 rounded-lg mb-4 mx-auto">
              <BarChartReport />
            </div>
            <div className="flex">
              <div className="p-2 rounded-lg flex-1">
                <LineChart />
              </div>
              <div className="p-2 rounded-lg ml-4 flex-1">
                <LineChartIncome />
              </div>
            </div>
            <div className="flex">
              <div className="p-2 rounded-lg ml-4 flex-1">
                <PieChartWallet />
              </div>
            </div>
          </>
        );
      case 'wallet':
        return (
          <div className="p-2 rounded-lg mx-auto">
            <PieChartWallet />
          </div>
        );
      case 'outcomes':
        return (
          <div className="p-2 rounded-lg mx-auto">
            <LineChart />
          </div>
        );
      case 'incomes':
        return (
          <div className="p-2 rounded-lg mx-auto">
            <LineChartIncome />
          </div>
        );
      // Add other cases for different charts if needed
      default:
        return null;
    }
  };

  return (
    <div>
      <div className='bg-slate-700 flex justify-center text-white'>
        <button
          onClick={() => handleLinkClick('all')}
          className={`m-2 text-blue ${activeButton === 'all' ? 'text-blue-500' : 'bg-transparent'} hover:text-blue-500`}
        >  All  
        </button>
        <button
          onClick={() => handleLinkClick('wallet')}
          className={`m-2 text-blue ${activeButton === 'wallet' ? 'text-blue-500' : 'bg-transparent'} hover:text-blue-500`}
        >  Wallet  
        </button>
        <button
          onClick={() => handleLinkClick('outcomes')}
          className={`m-2 text-blue ${activeButton === 'outcomes' ? 'text-blue-500' : 'bg-transparent'} hover:text-blue-500`}
        >  Outcome  
        </button>
        <button
          onClick={() => handleLinkClick('incomes')}
          className={`m-2 text-blue ${activeButton === 'incomes' ? 'text-blue-500' : 'bg-transparent'} hover:text-blue-500`}
        >  Income  
        </button>
        <button onClick={() => handleLinkClick('budget')} className='m-2'>Budget</button>
        <button onClick={() => handleLinkClick('categories')} className='m-2'>Categories</button>
      </div>
      <h2 style={{ textAlign:'center', fontSize: '2rem', color: '#ffff', fontStyle: 'italic', marginBottom: '1rem' }}>Hello {username} !</h2>

      <div className="flex flex-col bg-gray-100">
        {renderSelectedChart()}
      </div>
    </div>
  );
}
