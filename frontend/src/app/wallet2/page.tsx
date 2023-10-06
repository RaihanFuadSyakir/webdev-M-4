"use client"

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Wallet = () => {
  const [walletName, setWalletName] = useState('');
  const [budget, setBudget] = useState('');
  const [wallets, setWallets] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editWalletId, setEditWalletId] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === 'walletName') {
      setWalletName(value);
    } else if (name === 'budget') {
      setBudget(value);
    }
  };

  const addWallet = () => {
    if (walletName && budget) {
      const newWallet = {
        id: Date.now(),
        name: walletName,
        budget: parseFloat(budget),
      };
      setWallets([...wallets, newWallet]);
      setWalletName('');
      setBudget('');
    } else {
      console.error('Nama wallet dan budget harus diisi.');
    }
  };

  const editWallet = (id) => {
    const editedWallets = wallets.map((wallet) =>
      wallet.id === id ? { ...wallet, budget: parseFloat(budget) } : wallet
    );
    setWallets(editedWallets);
    setEditMode(false);
    setEditWalletId(null);
    setBudget('');
  };

  const deleteWallet = (id) => {
    const updatedWallets = wallets.filter((wallet) => wallet.id !== id);
    setWallets(updatedWallets);
  };

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
        label="Budget (Rp)"
        name="budget"
        type="number"
        value={budget}
        onChange={handleInput}
        fullWidth
        margin="normal"
      />
      {editMode ? (
        <Button color="primary" onClick={() => editWallet(editWalletId)}>
          Simpan Perubahan
        </Button>
      ) : (
        <Button color="primary" onClick={addWallet}>
          Tambah Wallet
        </Button>
      )}

      <div className="mt-4">
        <h2>Wallets</h2>
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet.id}>
              <strong>{wallet.name}</strong> - Budget: Rp {wallet.budget}
              <Button
                color="secondary"
                size="small"
                onClick={() => {
                  setEditMode(true);
                  setEditWalletId(wallet.id);
                  setWalletName(wallet.name);
                  setBudget(wallet.budget);
                }}
              >
                Edit
              </Button>
              <Button
                color="error"
                size="small"
                onClick={() => deleteWallet(wallet.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Wallet;