import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Wallet, dbResponse } from '@/utils/type';
import NewWalletForm from './NewWalletForm';

const WalletList = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    // Fetch list of wallets from the backend when the component mounts
    fetchWallets();
  }, []);

  const fetchWallets = () => {
    axiosInstance.get('/wallet/user/')
      .then((response: AxiosResponse<dbResponse<Wallet[]>>) => {
        setWallets(response.data.data);
      })
      .catch((err_response: AxiosError<dbResponse<Wallet[]>>) => {
        console.log(err_response.response?.data.msg);
      });
  };

  const handleDeleteWallet = (walletId: number) => {
    axiosInstance.delete(`/wallet/${walletId}`)
      .then((response: AxiosResponse<dbResponse<Wallet>>) => {
        console.log(response.data.msg);
        // Update wallets state after successful deletion
        setWallets((prevWallets: Wallet[]) => {
          return prevWallets.filter(wallet => wallet.id !== walletId);
        });
      })
      .catch((err_response: AxiosError<dbResponse<Wallet>>) => {
        console.log(err_response.response?.data.msg);
      });
  };

  return (
    <div className='bg-white h-auto w-96 m-4 rounded p-4 flex flex-col gap-4'>
      <NewWalletForm
        onWalletAdded={fetchWallets}
        onWalletEdited={() => {
          fetchWallets();
          setEditingWallet(null); // Reset editing state after successful update
        }}
        editingWallet={editingWallet}
      />
      <div>
        {wallets.map((wallet) => (
          <div key={wallet.id} className='flex items-center justify-between border p-4 rounded border-gray-300'>
            <div>
              <h3 className='font-semibold text-lg text-black'>{wallet.wallet_name}</h3>
              <p className='text-black'>Total ggg Balance: {wallet.total_balance}</p>
            </div>
            <div className='flex gap-2'>
              <button
                className='bg-yellow-500 text-white rounded p-2 hover:bg-yellow-700 hover:text-white mr-2'
                onClick={() => setEditingWallet(wallet)}
              >
                Edit
              </button>
              <button
                className='bg-red-500 text-white rounded p-2 hover:bg-red-700 hover:text-white'
                onClick={() => handleDeleteWallet(wallet.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletList;
