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
import { Popconfirm, message } from 'antd';

interface dataBudget {
  budgets: Budget[];
  setDataBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  setSelectedBudget: React.Dispatch<React.SetStateAction<Budget | null>>;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  setTotalBudget: React.Dispatch<React.SetStateAction<number>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<number>>;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ListBudget = ({budgets, setDataBudgets, setSelectedMonth, setTotalBudget, setDescription, setSelectedCategory }: dataBudget) => {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const handleDelete = (selectedOption: number) => {
    deleteBudget(selectedOption);
    message.success('Budget deleted successfully. Please refresh the page.', 5);
  }

  const columns: GridColDef[] = [
    {
      field: 'month',
      headerName: 'Month',
      width: 110,
      valueFormatter: (params) => months[params.value - 1]
    },
    {
      field: 'year',
      headerName: 'Year',
      width: 80,
    },
    {
      field: 'total_budget',
      headerName: 'Total Budget',
      width: 110,
      valueFormatter: (params) => `Rp. ${numeral(params.value).format('0,0')}`

    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 140 },
    {
      field: 'category', 
      headerName: 'Category', 
      width: 120,
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
              const budget = budgets.find((b: { id: number; }) => b.id === budgetId);
              setSelectedBudget(budget!);
              // Use the passed functions to update state in Budgets.tsx
              setSelectedMonth(`${budget?.year}-${budget?.month.toString().padStart(2, '0')}`);
              setTotalBudget(budget?.total_budget || 0);
              setDescription(budget?.description || '');
              setSelectedCategory(budget?.category_id || 0);
            }}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this budget?"
            onConfirm={() => handleDelete(params.row.id as number)}
            okText="Yes"
            okType="danger"
            cancelText="No"
          >
            <Button
              variant="outlined"
              color="secondary"
              className="bg-red-500 text-white rounded p-2 hover:bg-red-700 hover:text-white ml-2"
            >
              Delete
            </Button>
            </Popconfirm>
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
