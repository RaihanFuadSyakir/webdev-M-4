import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Wallet, dbResponse } from '@/utils/type';

const WalletList = () => {
  const [wallets, setWallets] = useState<Wallet[]>();

  useEffect(() => {
    // Fetch list of wallets from the backend when the component mounts
    axiosInstance.get('/wallet/user/')
      .then((response: AxiosResponse<dbResponse<Wallet[]>>) => {
        setWallets(response.data.data);
      })
      .catch((err_response: AxiosError<dbResponse<Wallet[]>>) => {
        console.log(err_response.response?.data.msg);
      });
  }, []); // Empty array ensures this effect runs once after initial render

  const handleDeleteWallet = (walletId: number) => {
    // Send DELETE request to the backend to delete the wallet with the given ID
    axiosInstance.delete(`/wallet/${walletId}`)
      .then((response: AxiosResponse<dbResponse<Wallet>>) => {
        console.log(response.data.msg); // Log success message
        // Update wallets state after successful deletion
        setWallets((prevWallets: Wallet[] | undefined) => {
          if (prevWallets) {
            return prevWallets.filter(wallet => wallet.id !== walletId);
          }
          return [];
        });
      })
      .catch((err_response: AxiosError<dbResponse<Wallet>>) => {
        console.log(err_response.response?.data.msg); // Log error message
        // Handle error (display error message, etc.) if needed
      });
  };
  

  return (
    <div className='bg-white h-96 w-96 m-4 rounded p-4 flex flex-col gap-4'>
      {wallets?.map((wallet) => (
        <div key={wallet.id} className='flex items-center justify-between border p-4 rounded border-gray-300'>
          <div>
            <h3 className='font-semibold text-lg text-black'>{wallet.wallet_name}</h3>
            <p className='text-black'>Total Balance: {wallet.total_balance}</p>
          </div>
          <button
            className='bg-red-500 text-white rounded p-2 hover:bg-blue-700 hover:text-white'
            onClick={() => handleDeleteWallet(wallet.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default WalletList;
