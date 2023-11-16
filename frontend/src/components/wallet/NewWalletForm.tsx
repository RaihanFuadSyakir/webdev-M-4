"use client"
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { Wallet, dbResponse } from '@/utils/type';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import InputAdornment from '@mui/material/InputAdornment';

interface NewWalletFormProps {
  onWalletAdded: () => void;
  onWalletEdited: () => void;
  editingWallet: Wallet | null;
}

const NewWalletForm: React.FC<NewWalletFormProps> = ({ onWalletAdded, onWalletEdited, editingWallet }) => {
  const [walletName, setWalletName] = useState('');
  const [totalBalance, setTotalBalance] = useState('');

  useEffect(() => {
    // Populate form fields when in edit mode
    if (editingWallet) {
      setWalletName(editingWallet.wallet_name);
    
      setTotalBalance(formatRupiah(editingWallet.total_balance.toString()));
    }
  }, [editingWallet]);

  const formatRupiah = (angka: string) => {
    var reverse = angka
      .toString()
      .split('')
      .reverse()
      .join('');
    var ribuan = reverse.match(/\d{1,3}/g);
    var hasil = ribuan?.join('.').split('').reverse().join('');
    return hasil!;
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Menghapus karakter selain angka
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
  
    setTotalBalance(formatRupiah(sanitizedValue));
  };
  

  const handleFormSubmit = async () => {
    try {
      if (!totalBalance) {
        // Handle validation error
        return;
      }
  
      const totalBalanceFix = totalBalance.replace(/[^a-zA-Z0-9]/g, '');

      const data = {
        wallet_name: walletName,
        total_balance: parseFloat(totalBalanceFix),
      };
  
      if (editingWallet) {
        // If in edit mode, send PUT request
        await axiosInstance.put('/wallet/${editingWallet.id}', data);
        onWalletEdited();
      } else {
        // If in add mode, send POST request
        await axiosInstance.post('/wallet/new', data);
        onWalletAdded();
      }
  
      // Reset input fields
      setWalletName('');
      setTotalBalance('');
    } catch (error) {
      // Handle error
      console.error("Failed to save wallet:", error);
    }
  };  

  return (
    <div className="flex-initial mt-2 rounded mb-4 p-5 text-black border border-stroke shadow-default">
      <h2 className="font-bold text-xl mb-2">Add New Wallet</h2>
      <TextField
        label="Wallet Name"
        name="walletName"
        value={walletName}
        onChange={(e) => setWalletName(e.target.value)}
        fullWidth
        margin="normal"
        disabled={!!editingWallet} // Disable the field in edit mode
      />
      <TextField
        label="Total Balance"
        name="totalBalance"
        type="text"
        value={totalBalance}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: <div>Rp </div>,
        }}
      />

      <Button
        className="bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
        onClick={handleFormSubmit}
      >
        {editingWallet ? 'Save Update' : 'Save'}
      </Button>
    </div>
  );
};

export default NewWalletForm;