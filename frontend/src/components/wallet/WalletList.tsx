import React, { useState } from 'react'
import { useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Wallet, dbResponse } from '@/utils/type';
export default function WalletList() {
    const [wallets,setWallets] = useState<Wallet[]>()
    useEffect(() => {
        // Fetch list of wallets from the backend when the component mounts
        axiosInstance.get('/wallet/user/')
        .then((response : AxiosResponse<dbResponse<Wallet[]>>) =>{
            setWallets(response.data.data);
        })
        .catch((err_response : AxiosError<dbResponse<Wallet[]>>)=>{
            console.log(err_response.response?.data.msg);
        })
      }, []); // Empty array ensures this effect runs once after initial render
  return (
    <div className='bg-amber-100 h-96 w-96 m-4 rounded'>
        {wallets?.map((wallet)=>(
            <div className='flex justify-items-center'>
                <div className='flex-auto'>{wallet.wallet_name}</div>
                <div className='flex-auto'>{wallet.total_balance}</div>
            </div>
        ))}
    </div>
  )
}
