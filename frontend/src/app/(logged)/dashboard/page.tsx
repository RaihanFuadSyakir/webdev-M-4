"use client"
import LineChart from '@/components/Dashboard/LineChart';
import axiosInstance from '@/utils/fetchData';
import { User, dbResponse } from '@/utils/type';
import { AxiosResponse } from 'axios';
// No code changes needed. Run `npm install axios @types/axios` in the terminal to install required packages.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    <div >
      <div className='bg-slate-700 flex text-white'>
        <Link href='outcomes' className='m-2'>Outcomes</Link>
        <Link href='incomes' className='m-2'>Incomes</Link>
        <Link href='budget' className='m-2'>Budget</Link>
        <Link href='categories' className='m-2'>Category</Link>
      </div>
      <h1>Dashboard</h1>
      <h2>Hello {username}</h2>
      
      <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div style={{ width: '800px' }}> {/* Menambahkan gaya CSS untuk mengatur lebar */}
          <LineChart />
        </div>
      </div>
    </div>
    </div>
  );
};