import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Category, Outcome, dbResponse } from '@/utils/type';
import { Axios, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface CategoryProps {
  categories: Category[]
}
const ListCategories = ({ categories }: CategoryProps) => {

  return (
    <div className='w-full'>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Category Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>

                <TableCell component="th" scope="row">{category.category_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListCategories;
