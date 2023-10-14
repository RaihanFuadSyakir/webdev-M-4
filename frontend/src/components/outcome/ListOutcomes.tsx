// ListOutcomes.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Outcome, dbResponse } from '@/utils/type';
import { Axios, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const formattedDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
}

const ListOutcomes = () => {
  const [Outcomes, setOutcomes] = useState<Outcome[]>([]);
    
  // Fetch outcomes data when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`${BACKEND_URL}/api/outcomes/`) // Replace with your actual endpoint
      .then((response : AxiosResponse<dbResponse<Outcome[]>>) => {
        const res : dbResponse<Outcome[]> = response.data;
        console.log(res,"db")
        setOutcomes(res.data);
        console.log(Outcomes);
      })
      .catch((error) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total Outcome</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Outcomes.map((outcome) => (
              <TableRow key={outcome.id}>
                <TableCell component="th" scope="row">
                  {formattedDateString(outcome.date)}
                </TableCell>
                <TableCell align="right">{outcome.total_outcome}</TableCell>
                <TableCell>{outcome.description}</TableCell>
                <TableCell>{outcome.category_id}</TableCell>
                <TableCell>{outcome.wallet_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListOutcomes;
