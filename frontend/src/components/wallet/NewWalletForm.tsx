"use client"
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Wallet, dbResponse } from '@/utils/type';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
      setTotalBalance(editingWallet.total_balance.toString());
    }
  }, [editingWallet]);

  const handleFormSubmit = async () => {
    try {
      if (!totalBalance) {
        // Handle validation error
        return;
      }

      const data = {
        wallet_name: walletName,
        total_balance: parseFloat(totalBalance),
      };

      if (editingWallet) {
        // If in edit mode, send PUT request
        await axiosInstance.put(`/wallet/${editingWallet.id}`, data);
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
    <div className="rounded mb-4 p-2 text-black">
      <h2 className="font-bold text-xl mb-2">Wallet</h2>
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
        label="Total Balance (Rp)"
        name="totalBalance"
        type="number"
        value={totalBalance}
        onChange={(e) => setTotalBalance(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        className="bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
        onClick={handleFormSubmit}
      >
        {editingWallet ? 'Update Wallet' : 'Add Wallet'}
      </Button>
    </div>
  );
};

export default NewWalletForm;
