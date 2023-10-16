// ListIncomes.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Income, dbResponse } from '@/utils/type';

import { Axios, AxiosError, AxiosResponse } from 'axios';


import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField'; // Import the TextField component
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import WalletSelect from '@/components/wallet/WalletSelect';


const ListIncomes = ({ seed }: { seed: number }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [editedIncome, setEditedIncome] = useState<Income | null>(null);
  const [editedDate, setEditedDate] = useState<string>(''); // Use a string for the date input
  const [editedTotalIncome, setEditedTotalIncome] = useState<number | null>(null);
  const [editedWalletId, setEditedWalletId] = useState<number | null>(null);
  const [wallets, setWallets] = useState(0);
  const [editedDescription, setEditedDescription] = useState<string>('');

  

  const handleDelete = (selectedOption: number) => {
    deleteIncome(selectedOption);
  }

  const handleEdit = (income: Income) => {
    setEditedIncome(income);
    setEditedDate(income.date);
    setEditedTotalIncome(income.total_income);
    setEditedWalletId(income.wallet?.id || null);
  }

  const handleCancelEdit = () => {
    setEditedIncome(null);
  }

  // Fetch Incomes data when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`/incomes/user`) // Replace with your actual endpoint
      .then((response: AxiosResponse<dbResponse<Income[]>>) => {
        const res: dbResponse<Income[]> = response.data;
        setIncomes(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch incomes:', error);
      });
  }, [seed]);

  const handleSaveEdit = () => {
    if (editedIncome) {
      // Construct the edited income object
      const editedIncomeData = {
        id: editedIncome.id,
        date: editedDate,
        total_income: editedTotalIncome,
        wallet_id: editedWalletId,
        description: editedDescription,
      };
      // Send a PUT or PATCH request to update the income on the server
      axiosInstance.put(`/incomes/${editedIncome.id}`, editedIncomeData)
        .then(() => {
          console.log("edit success");
          setEditedIncome(null); // Close the edit form after successful update
        })
        .catch((res_err: AxiosError<dbResponse<Income>>) => {
          console.log(JSON.stringify(res_err.response?.data));
        });
    }
  }
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = e.target.value; // Make sure it matches the expected format

    setEditedDate(formattedDate);
  };

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
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell component="th" scope="row">
                  {
                    income.date
                  }</TableCell>

                <TableCell>
                {editedIncome === income ? (
                  <TextField
                    type="number"
                    value={editedTotalIncome}
                    onChange={(e) => setEditedTotalIncome(parseFloat(e.target.value))}
                  />
                ) : (
                  income.total_income
                )}
                </TableCell>
                <TableCell>
                {editedIncome === income ? (
                  <TextField
                    type="text"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                ) : (
                  income.description
                )}
                </TableCell>
                <TableCell>{income.wallet?.wallet_name} 
                </TableCell>
                <TableCell>
                {editedIncome === income ? (
                    <>
                      <Button variant="outlined" color="primary" onClick={handleSaveEdit}>
                        Save
                      </Button>
                      <Button variant="outlined" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </>
                ) : (
                  <>
                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(income.id)}>
                      Delete
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(income)}>
                      Edit
                    </Button>
                  </>
                )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

function deleteIncome(id: number) {
  axiosInstance.delete(`/income/delete/${id}`)
    .then(() => {
      console.log("delete success");
    })
    .catch((res_err: AxiosError<dbResponse<Income>>) => {
      console.log(JSON.stringify(res_err.response?.data));
    })
}

export default ListIncomes;
