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
import ListIncomes from '@/components/income/ListIncome';

const Incomes = () => {
  const [nominal, setNominal] = useState(0);
  const [description, setDescription] = useState('');
  const [wallet, setWallet] = useState(0);
  const [date, setDate] = useState(''); // Add date state
  const [nominalError, setNominalError] = useState('');
  const [walletError, setWalletError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seed,setSeed] = useState(0);
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
    } else if (name === 'description') {
      setDescription(value);
    } else if (name === 'wallet') {
      //setWallet(value);
    } else if (name === 'date') { // Handle date input change
      setDate(value);
    }
  };

  const addIncome = async () => {
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
        total_income: nominal,
        description: description,
        wallet_id: wallet,
      };
      console.log(data);
      axiosInstance
        .post(`/incomes/new`, data, {
          withCredentials: true,
        })
        .then((response) => {
          setError('');
          // Optionally, you can reset the form fields here
          setNominal(0);
          setDescription('');
          setWallet(0);
          setDate(''); // Reset the date field
          setSeed(Math.floor(Math.random()))
        })
        .catch((error: AxiosError) => {
          console.log("axios",error)
          setError('Failed to add income.');
        });
    } catch (error) {
      console.log("try",error)
      // Handle validation errors or other errors if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      { <div className='max-w-xl'>
        <div>
          <h2>Income</h2>
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
        <Button color="secondary" onClick={addIncome}>
          Tambahkan
        </Button>
      </div> }
      <ListIncomes seed={seed}/>
    </div>
    
  );
};

export default Incomes;
