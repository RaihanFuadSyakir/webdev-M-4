"use client"
import CategorySelect from '@/components/category/CategorySelect'
import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { ZodError } from 'zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Category, Outcome, Income, dbResponse } from '@/utils/type';
import { currencySchema } from '@/utils/validation';
import InputAdornment from '@mui/material/InputAdornment';
import ListCategories from '@/components/category/ListCategory';
import Breadcrumb from '@/components/template/Breadcrumbs/Breadcrumb';
import ListExpensesByCategory from '@/components/category/ListExpensesByCategory';

export default function Categories() {
  const [SelectedCategory, setSelectedCategory] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  // Fetch incomes and outcomes data when the component mounts
  useEffect(() => {
    const fetchIncome = axiosInstance.get(`/incomes/user`); // Replace with your actual endpoint
    const fetchOutcome = axiosInstance.get(`${BACKEND_URL}/api/outcomes/`); // Replace with your actual endpoint

    Promise.all([fetchIncome, fetchOutcome])
      .then((responses) => {
        const incomeResponse = responses[0];
        const outcomeResponse = responses[1];

        const incomeData = incomeResponse.data.data;
        const outcomeData = outcomeResponse.data.data;

        setIncomes(incomeData);
        setOutcomes(outcomeData);
      })
      .catch((errors) => {
        const incomeError = errors[0];
        const outcomeError = errors[1];

        console.error('Failed to fetch incomes:', incomeError);
        console.error('Failed to fetch outcomes:', outcomeError);
      });
  }, []);

  // Fetch outcomes data when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/categories/user`) // Replace with your actual endpoint
      .then((response: AxiosResponse<dbResponse<Category[]>>) => {
        const res: dbResponse<Category[]> = response.data;
        console.log(res, "db")
        setCategories(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch categories:', error);
      });
  }, []);
  return (
    <>
      <Breadcrumb pageName="Categories" />
      <div className="flex mt-2 p-5 bg-white rounded-sm border border-stroke shadow-default">
        <div className='w-2/3'>
          <div className='w-full my-2 p-2'>
            <h2 className="font-bold text-xl mb-2">Create Category</h2>
            <CategorySelect setSelectedCategory={setSelectedCategory} setNewCategories={setCategories} />
          </div>
          <div className='w-full p-2'>
          <h2 className="font-bold text-xl mb-2">Category List</h2>
            <ListCategories categories={categories} setNewCategories={setCategories} />
          </div>
        </div>
        <div className='w-auto m-2 p-2'>
          <ListExpensesByCategory incomes={incomes} outcomes={outcomes} />
        </div>
      </div>
    </>
  )
}
