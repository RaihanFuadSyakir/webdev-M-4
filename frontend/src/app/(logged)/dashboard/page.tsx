"use client"
import LineChart from '@/components/Dashboard/LineChart';
import LineChartIncome from '@/components/Dashboard/LineChartIncome';
import BarChartReport from '@/components/Dashboard/BarChartReport';
import axiosInstance from '@/utils/fetchData';
import { User, dbResponse } from '@/utils/type';
import { AxiosResponse } from 'axios';
// No code changes needed. Run `npm install axios @types/axios` in the terminal to install required packages.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PieChartWallet from '@/components/Dashboard/PieChartWallet';
export default function Dashboard() {
  const router = useRouter()
  const [username, setUsername] = useState('');
  console.log(username);
  useEffect(() => {
    axiosInstance.get('/users/personal')
      .then((response: AxiosResponse<dbResponse<User>>) => {
        setUsername(response.data.data.username);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        router.push('/login')
      })
  }, [])
  return (
    <div>
      <div className='bg-slate-700 flex text-white'>
        <Link href='outcomes' className='m-2'>Outcomes</Link>
        <Link href='incomes' className='m-2'>Incomes</Link>
        <Link href='budget' className='m-2'>Budget</Link>
        <Link href='categories' className='m-2'>Categories</Link>
      </div>
      <h1>Dashboard</h1>
      <h2>Hello {username}</h2>

      <div className="flex flex-col bg-gray-100">
        <div className="p-4 rounded-lg mb-4 mx-auto">
          <BarChartReport />
        </div>
        <div className="flex mb-10">
          <div className="p-4 rounded-lg flex-1">
            <LineChart />
          </div>
          <div className="p-4 rounded-lg ml-4 flex-1">
            <LineChartIncome />
          </div>
        </div>
        <div className="flex">
          <div className="p-4 rounded-lg ml-4 flex-1">
            <PieChartWallet />
          </div>
        </div>
      </div>



    </div>
  );
}