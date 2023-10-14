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

const ListCategories = ({seed} : {seed: number}) => {
    const [Categories, setCategories] = useState<Category[]>([]);
      
    // Fetch outcomes data when the component mounts
    useEffect(() => {
      axiosInstance
        .get(`${BACKEND_URL}/api/categories/user`) // Replace with your actual endpoint
        .then((response : AxiosResponse<dbResponse<Category[]>>) => {
          const res : dbResponse<Category[]> = response.data;
          console.log(res,"db")
          setCategories(res.data);
          console.log(Categories);
        })
        .catch((error) => {
          console.error('Failed to fetch categories:', error);
        });
    }, [seed]);
  
    return (
      <div className='max-w-2xl'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Category Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Categories.map((category) => (
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
  