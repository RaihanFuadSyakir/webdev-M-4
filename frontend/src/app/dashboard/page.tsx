"use client"
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/fetchData';
import { User, dbResponse } from '@/utils/type';
import { AxiosResponse } from 'axios';
import Link from 'next/link';
export default function Dashboard() {
  const [username,setUsername] = useState('');
  useEffect(()=>{
    axiosInstance.get('/users/personal')
    .then((response : AxiosResponse<dbResponse<User>>)=>{
      setUsername(response.data.data.username);
      console.log(response);
    })
    .catch((error)=>{
      console.log(error);
    })
  },[])
  return (
    <div >
      <div className='bg-slate-700 flex text-white'>
        <Link href='outcomes' className='m-2'>Outcomes</Link>
        <Link href='outcomes' className='m-2'>Incomes</Link>
      </div>
      <h1>Dashboard</h1>
      <h2>Hello {username}</h2>
    </div>
  )
}
