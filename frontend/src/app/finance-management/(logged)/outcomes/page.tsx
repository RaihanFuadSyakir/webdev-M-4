"use client"

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { ZodError } from 'zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Outcome, Wallet, dbResponse } from '@/utils/type';
import WalletSelect from '@/components/wallet/WalletSelect';
import { currencySchema } from '@/utils/validation';
import InputAdornment from '@mui/material/InputAdornment';
import CategorySelect from '@/components/category/CategorySelect';
import ListOutcomes from '@/components/outcome/ListOutcomes';
import Breadcrumb from '@/components/template/Breadcrumbs/Breadcrumb';
import numeral from 'numeral';
import { message } from 'antd';

const Outcomes = () => {
  const [nominal, setNominal] = useState(0);
  const [category, setCategory] = useState(0);
  const [description, setDescription] = useState('');
  const [wallet, setWallet] = useState(0);
  const [date, setDate] = useState(''); // Add date state
  const [nominalError, setNominalError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [walletError, setWalletError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  // Fetch outcomes data when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/outcomes/`) // Replace with your actual endpoint
      .then((response: AxiosResponse<dbResponse<Outcome[]>>) => {
        const res: dbResponse<Outcome[]> = response.data;
        setOutcomes(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }, []);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'nominal') {
      try {
        // const parsedNominal = currencySchema.parse(parseInt(value));
        const parsedNominal = numeral(value).value() ?? 0;
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
      if (!category) {
        setCategoryError('Please select a category.');
        setLoading(false);
        return;
      }
      // Create a data object to send in the POST request

      const data = {
        date: new Date(date),
        total_outcome: nominal,
        description: description,
        category_id: category,
        wallet_id: wallet,
      };
      axiosInstance
        .post(`/outcome/new`, data, {
          withCredentials: true,
        })
        .then((response: AxiosResponse<dbResponse<Outcome>>) => {
          setError('');
          // Optionally, you can reset the form fields here
          setNominal(0);
          setDescription('');
          setDate(''); // Reset the date field
          const newData = response.data.data
          setOutcomes((prev) => [...prev, newData])
          message.success('Outcome added successfully', 5);
        })
        .catch((error: AxiosError) => {
          console.log("axios", error)
          setError('Failed to add outcome.');
        });
    } catch (error) {
      console.log("try", error)
      // Handle validation errors or other errors if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Outcome" />
      <div className="sm:flex">
        <div className='flex-initial sm:w-73 mt-2 p-5 bg-white rounded-sm border border-stroke shadow-default'>
          <div>
            <h2>Nominal</h2>
            <TextField
              className='w-full m-0'
              fullWidth
              error={nominalError !== ''}
              id={nominalError !== '' ? "outlined-required" : "outlined-error-helper-text"}
              name="nominal"
              sx={{ m: 1, width: 'auto' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
              }}
              helperText={nominalError}
              value={numeral(nominal).format('0,0')}
              onChange={handleInput}
            />
          </div>
          <div>
            <h2>Category</h2>
            <CategorySelect setSelectedCategory={setCategory} />
            {categoryError && <div>{categoryError}</div>}
          </div>
          <div>
            <h2>Wallet</h2>
            <WalletSelect setSelectedWallet={setWallet} />
            {walletError && <div>{walletError}</div>}
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
            <TextField 
              multiline 
              rows={5} 
              fullWidth 
              name='description' 
              id='deskripsi' 
              value={description} 
              onChange={handleInput}
            />
          </div>
          <div className='mt-2'>
            <Button
              onClick={addOutcome}
              variant="contained"
              color="success"
              className='bg-green-500 text-white rounded p-2 hover:bg-green-700 hover:text-white mr-2'
            >
              Save
            </Button>
          </div>
        </div>
        <div className='flex-1 p-2'>          
          <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default">
            <div className="m-5">
              <h2 className="font-bold text-xl mb-2 text-black">Outcome List</h2>
              <ListOutcomes outcomes={outcomes} setOutcomes={setOutcomes} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Outcomes;
