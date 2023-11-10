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
import { Category, dbResponse } from '@/utils/type';
import { currencySchema } from '@/utils/validation';
import InputAdornment from '@mui/material/InputAdornment';
import ListCategories from '@/components/category/ListCategory';
import Breadcrumb from '@/components/template/Breadcrumbs/Breadcrumb';
import ListExpensesByCategory from '@/components/category/ListExpensesByCategory';

export default function Categories() {
  const [SelectedCategory, setSelectedCategory] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
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
        <div className='w-1/3'>
          <div className='w-full my-2 p-2'>
            <CategorySelect setSelectedCategory={setSelectedCategory} setNewCategories={setCategories} />
          </div>
          <div className='w-full p-2'>
            <ListCategories categories={categories} setNewCategories={setCategories} />
          </div>
        </div>
        <div className='w-auto m-2 p-2'>
          <ListExpensesByCategory />
        </div>
      </div>
    </>
  )
}
