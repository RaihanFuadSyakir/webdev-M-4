"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/constants';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const WalletPage = () => {
  const [walletName, setWalletName] = useState('');
  const [totalBalance, setTotalBalance] = useState('');
  const [wallets, setWallets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'walletName') {
      setWalletName(value);
    } else if (name === 'totalBalance') {
      setTotalBalance(value);
    }
  };

  const addWallet = () => {
    setLoading(true);
    try {
      if (!walletName || !totalBalance) {
        setError('Nama wallet dan total balance harus diisi.');
        setLoading(false);
        return;
      }

      const data = {
        wallet_name: walletName,
        total_balance: parseFloat(totalBalance),
      };

      axios
        .post(`${BACKEND_URL}/api/wallet/new`, data, {
          withCredentials: true,
        })
        .then((response) => {
          setError('');
          // Reset form fields
          setWalletName('');
          setTotalBalance('');
          // Optionally, you can refresh the wallet list here by making another GET request
        })
        .catch((error) => {
          setError('Gagal menambahkan wallet.');
        });
    } catch (error) {
      setError('Gagal menambahkan wallet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch list of wallets from the backend when the component mounts
    axios
      .get(`${BACKEND_URL}/api/wallets`)
      .then((response) => {
        setWallets(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // Empty array ensures this effect runs once after initial render

  return (
    <div className="h-96 w-96 bg-amber-100 rounded p-4">
      <h2>Tambah Wallet</h2>
      <TextField
        label="Nama Wallet"
        name="walletName"
        value={walletName}
        onChange={handleInput}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Total Balance (Rp)"
        name="totalBalance"
        type="number"
        value={totalBalance}
        onChange={handleInput}
        fullWidth
        margin="normal"
      />
      <Button color="primary" onClick={addWallet}>
        Tambah Wallet
      </Button>

      <div className="mt-4">
        <h2>Wallets</h2>
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet.id}>
              <strong>{wallet.wallet_name}</strong> - Total Balance: Rp {wallet.total_balance}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WalletPage;
