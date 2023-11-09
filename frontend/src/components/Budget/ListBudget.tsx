import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Budget, Category, dbResponse } from '@/utils/type';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import { format } from 'date-fns'
import numeral from 'numeral';

interface dataBudget {
  budgets: Budget[]
  setDataBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
}
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const ListBudget = ({ budgets, setDataBudgets }: dataBudget) => {
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

  const columns: GridColDef[] = [
    {
      field: 'month',
      headerName: 'Month',
      width: 110,
      valueFormatter: (params) => months[params.value - 1]
    },
    {
      field: 'year',
      headerName: 'year',
      width: 80,
    },
    {
      field: 'total_budget',
      headerName: 'Total Budget',
      width: 110,
      valueFormatter: (params) => `Rp. ${numeral(params.value).format('0,0')}`

    },
    { field: 'description', headerName: 'Description', width: 120 },
    {
      field: 'category', headerName: 'Category', width: 120,
      valueFormatter: (params: GridValueFormatterParams<Category>) => params.value.category_name
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 hover:text-white"
            onClick={() => {
              const budgetId = params.row.id as number;
              const budget = budgets.find((b) => b.id === budgetId);
              setSelectedBudget(budget!);
              setIsUpdateModalOpen(true);
            }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className="bg-red-500 text-white rounded p-2 hover:bg-red-700 hover:text-white ml-2"
            onClick={() => handleDelete(params.row.id as number)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-3xl">
      <DataGrid
        rows={budgets}
        columns={columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        checkboxSelection={false}
      />

      
    </div>
  );

};
function deleteBudget(id: number) {
  axiosInstance
    .delete(`/budget/delete/${id}`)
    .then(() => {
      console.log("delete success");
    })
    .catch((res_err: AxiosError<dbResponse<Budget>>) => {
      console.log(JSON.stringify(res_err.response?.data));
    })
}
export default ListBudget;
