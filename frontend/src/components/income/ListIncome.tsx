// ListIncomes.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Income, dbResponse } from '@/utils/type';
import { Axios, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const ListIncomes = ({seed} : {seed: number}) => {
  const [Incomes, setIncomes] = useState<Income[]>([]);
    
  // Fetch Incomes data when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`/incomes/user`) // Replace with your actual endpoint
      .then((response : AxiosResponse<dbResponse<Income[]>>) => {
        const res : dbResponse<Income[]> = response.data;
        console.log(res,"db")
        setIncomes(res.data);
        console.log(Incomes);
      })
      .catch((error) => {
        console.error('Failed to fetch incomes:', error);
      });
  }, [seed]);

  return (
    <div className='max-w-2xl'>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Total Income</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Wallet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Incomes.map((Income) => (
              <TableRow key={Income.id}>

                <TableCell component="th" scope="row">{Income.date}</TableCell>
                <TableCell align="right">{Income.total_income}</TableCell>
                <TableCell>{Income.description}</TableCell>
                <TableCell>{Income.wallet?.wallet_name}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListIncomes;
