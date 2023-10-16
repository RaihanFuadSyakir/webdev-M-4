import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Budget, dbResponse } from '@/utils/type';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import BudgetUpdateModal from './BudgetUpdateModal';

interface dataBudget{
    budgets : Budget[]
}

const ListBudget = ({budgets} : dataBudget) => {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); 

  const handleDelete = (selectedOption: number) => {
        deleteBudget(selectedOption);
  }

  const handleUpdate = (budget: Budget) => {
    // setSelectedBudget(budget);
    // setIsUpdateModalOpen(true);

    if (!selectedBudget) {
      console.error('No budget selected for update.');
      return;
    }

    // Simulated update data
    const updatedBudgetData = {
      ...selectedBudget,
      description: 'Updated Description', // Update the description for demonstration
    };

    // Simulated API call to update the budget
    axiosInstance
      .put(`/budget/${selectedBudget.id}`, updatedBudgetData)
      .then((response) => {
        console.log('Budget updated successfully:', response.data);
        // Update the budget in the UI or refetch the data
        // For simplicity, we're just logging the response
      })
      .catch((error) => {
        console.error('Error updating budget:', error);
      });

    // Close the modal after handling the update
    setIsUpdateModalOpen(false);
  };

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
            {budgets.map((budget) => (
              <TableRow key={budget.id}>

                <TableCell component="th" scope="row">{budget.date}</TableCell>
                <TableCell>{budget.month}</TableCell>
                <TableCell align="right">{budget.total_budget}</TableCell>
                <TableCell>{budget.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 hover:text-white"
                    onClick={() => {
                      setSelectedBudget(budget)
                      setIsUpdateModalOpen(true)
                    }}
                  >
                    Update
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className='bg-red-500 text-white rounded p-2 hover:bg-red-700 hover:text-white mr-2'
                    onClick={() => handleDelete(budget.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedBudget && (
      <BudgetUpdateModal
          isOpen={isUpdateModalOpen}
          closeModal={() => setIsUpdateModalOpen(false)}
          budget={selectedBudget} handleUpdate={function (): void {
            throw new Error('Function not implemented.');
          } }        />
    )}
    </div>
  );
};
function deleteBudget(id: number) {
    axiosInstance.delete(`/budget/delete/${id}`)
      .then(() => {
        console.log("delete success");
      })
      .catch((res_err: AxiosError<dbResponse<Budget>>) => {
        console.log(JSON.stringify(res_err.response?.data));
      })
  }
export default ListBudget;
