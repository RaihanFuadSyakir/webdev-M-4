// ListOutcomes.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Outcome, dbResponse } from '@/utils/type';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
interface OutcomeProps{
  outcomes : Outcome[];
}

const ListOutcomes = ({outcomes} : OutcomeProps) => {
  const handleDelete = (selectedOption: number) => {
    deleteOutcome(selectedOption);
  }
  return (
    <div className='max-w-2xl'>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Total Outcome</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Wallet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outcomes.map((outcome) => (
              <TableRow key={outcome.id}>
                <TableCell component="th" scope="row">{outcome.date}</TableCell>
                <TableCell align="right">{outcome.total_outcome}</TableCell>
                <TableCell>{outcome.description}</TableCell>
                <TableCell>{outcome.category?.category_name}</TableCell>
                <TableCell>{outcome.wallet?.wallet_name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(outcome.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

function deleteOutcome(id: number) {
  axiosInstance.delete(`/outcome/delete/${id}`)
    .then(() => {
      console.log("delete success");
    })
    .catch((res_err: AxiosError<dbResponse<Outcome>>) => {
      console.log(JSON.stringify(res_err.response?.data));
    })
}
export default ListOutcomes;
