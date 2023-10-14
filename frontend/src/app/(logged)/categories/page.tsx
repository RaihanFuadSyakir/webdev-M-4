"use client"
import CategorySelect from '@/components/category/CategorySelect'
import React, { useState } from 'react';
import { BACKEND_URL } from '@/constants';
import axiosInstance from '@/utils/fetchData';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { dbResponse } from '@/utils/type';
import { currencySchema } from '@/utils/validation';
import InputAdornment from '@mui/material/InputAdornment';
import ListCategories from '@/components/category/ListCategory';

export default function Categories() {
    const [SelectedCategory,setSelectedCategory] = useState(0);
    const [seed,setSeed] = useState(0);
    console.log(SelectedCategory);
  return (
    <div className='bg-amber-100'>
      <div>
        <CategorySelect setSelectedCategory={setSelectedCategory}/>
      </div>
      <div>
        <ListCategories seed={seed}/>
      </div>
    </div>
    
  )
}
