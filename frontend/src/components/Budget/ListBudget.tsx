// Date        
// Month       
// TotalBudget 
// Description

// ListOutcomes.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Budget, dbResponse } from '@/utils/type';
import { Axios, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const ListBudget = ({seed} : {seed: number}) => {
  const [Budget, setBudget] = useState<Budget[]>([]);
    
  // Fetch outcomes data when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/budget/`) // Replace with your actual endpoint
      .then((response : AxiosResponse<dbResponse<Budget[]>>) => {
        const res : dbResponse<Budget[]> = response.data;
        console.log(res,"db")
        setBudget(res.data);
        console.log(Budget);
      })
      .catch((error) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }, [seed]);

  return (
    <div className='max-w-2xl'>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Month</TableCell>
              <TableCell align="center">Total Budget</TableCell>
              <TableCell align="center">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Budget.map((budget) => (
              <TableRow key={budget.id}>

                <TableCell component="th" scope="row">{budget.date}</TableCell>
                <TableCell>{budget.month}</TableCell>
                <TableCell align="right">{budget.total_budget}</TableCell>
                <TableCell>{budget.description}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListBudget;
