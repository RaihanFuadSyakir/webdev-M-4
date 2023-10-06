"use client"

import React, { useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Outcome, Wallet, dbResponse } from '@/utils/type';
import WalletSelect from '@/components/wallet/WalletSelect';
import { currencySchema } from '@/utils/validation';
import InputAdornment from '@mui/material/InputAdornment';
import CategorySelect from '@/components/category/CategorySelect';

const Outcomes = () => {
  const [nominal, setNominal] = useState(0);
  const [category, setCategory] = useState(0);
  const [description, setDescription] = useState('');
  const [wallet, setWallet] = useState(0);
  const [date, setDate] = useState(''); // Add date state
  console.log(wallet);
  console.log(date);
  const [nominalError, setNominalError] = useState('');
  const [walletError, setWalletError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'nominal') {
      try {
        const parsedNominal = currencySchema.parse(parseInt(value));
        setNominal(parsedNominal);
        setNominalError('');
      } catch (error) {
        if (error instanceof ZodError) {
          setNominalError(error.issues[0].message);
        }
      }
    } else if (name === 'category') {
      // setCategory(value);
    } else if (name === 'description') {
      setDescription(value);
    } else if (name === 'wallet') {
      //setWallet(value);
    } else if (name === 'date') { // Handle date input change
      setDate(value);
    }
  };

  const addOutcome = async () => {
    setLoading(true);
    try {
      // Check if wallet is selected
      if (!wallet) {
        setWalletError('Please select a wallet.');
        setLoading(false);
        return;
      }

      // Create a data object to send in the POST request
      
      const data= {
        date: new Date(date),
        total_outcome: nominal,
        description: description,
        category_id: category,
        wallet_id: wallet,
      };
      console.log(data)
      axiosInstance
        .post(`${BACKEND_URL}/api/outcome/new`, data, {
          withCredentials: true,
        })
        .then((response) => {
          setError('');
          // Optionally, you can reset the form fields here
          setNominal(0);
          setCategory(0);
          setDescription('');
          setWallet(0);
          setDate(''); // Reset the date field
        })
        .catch((error: AxiosError) => {
          console.log("axios",error)
          setError('Failed to add outcome.');
        });
    } catch (error) {
      console.log("try",error)
      // Handle validation errors or other errors if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-96 w-96 bg-amber-100 rou">
      <div className="w-full">
        <h2>Outcome</h2>
        <TextField
          error={nominalError !== ''}
          id={nominalError !== '' ? "outlined-required" : "outlined-error-helper-text"}
          label="Nominal"
          name="nominal"
          sx={{ m: 1, width: 'auto' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
          }}
          helperText={nominalError}
          value={nominal}
          onChange={handleInput}
        />
      </div>
      <div>
        <h2>Category</h2>
        <CategorySelect setSelectedCategory={setCategory} />
      </div>
      <div>
        <h2>Wallet</h2>
        <WalletSelect setSelectedWallet={setWallet} />
      </div>
      <div>
        <h2>Date</h2>
        <TextField
          type="date"
          name="date"
          value={date}
          onChange={handleInput}
        />
      </div>
      <div>
        <h2>Deskripsi</h2>
        <textarea name="description" id="deskripsi" rows={6} onChange={handleInput}></textarea>
      </div>
      <Button color="secondary" onClick={addOutcome}>
        Tambahkan
      </Button>
    </div>
  );
};

export default Outcomes;
