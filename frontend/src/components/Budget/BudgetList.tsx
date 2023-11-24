import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from 'axios';
import { Budget, dbResponse } from '@/utils/type';
import NewBudgetForm from './NewBudgetForm';
import { Popconfirm, message } from 'antd';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
  TablePagination
} from '@mui/material';
import { getMonth } from 'date-fns'; // Assuming you have date-fns installed

const BudgetList = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = () => {
    axiosInstance.get('/budgets/')
      .then((response: AxiosResponse<dbResponse<Budget[]>>) => {
        setBudgets(response.data.data);
      })
      .catch((err_response: AxiosError<dbResponse<Budget[]>>) => {
        console.log(err_response.response?.data.msg);
      });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1); // Months are 0-indexed in JavaScript
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  };

  const handleDeleteBudget = (budgetId: number) => {
    axiosInstance.delete(`/budget/delete/${budgetId}`)
      .then((response: AxiosResponse<dbResponse<Budget>>) => {
        setBudgets((prevBudgets: Budget[]) => {
          return prevBudgets.filter(budget => budget.id !== budgetId);
        });
        message.success('Budget deleted successfully', 5);
      })
      .catch((err_response: AxiosError<dbResponse<Budget>>) => {
        console.error('Error deleting budget:', err_response);
        message.error('Failed Deleting budget with ID:', budgetId);
      });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, budgets.length - page * rowsPerPage);

  return (
    <div className='sm:flex'>
      <div className='flex-initial sm:w-1/3 m-4 rounded p-4 flex flex-col gap-4 bg-white'>
        <NewBudgetForm
          onBudgetAdded={fetchBudgets}
          onBudgetUpdated={() => {
            fetchBudgets();
            setEditingBudget(null);
          }}
          selectedBudget={editingBudget}
        />
      </div>
      <div className='flex-initial sm:w-2/3 m-4 rounded p-4 flex flex-col gap-4 bg-white'>
        <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default">
          <div className="m-5">
            <h2 className="font-bold text-xl mb-2 text-black">Budget List</h2>
              <TableContainer component={Paper} className='max-h-96 overflow-auto'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Month</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Year</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Total Budget</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? budgets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : budgets
                    ).map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell>{getMonthName(budget.month)}</TableCell>
                        <TableCell>{budget.year}</TableCell>
                        <TableCell>{formatCurrency(budget.total_budget)}</TableCell>
                        <TableCell>{budget.description}</TableCell>
                        <TableCell>{budget.category.category_name}</TableCell>
                        <TableCell>
                          <div className="flex">
                            <Button
                              variant="contained"
                              color="primary"
                              className={`bg-yellow-500 text-white rounded p-2 hover:bg-yellow-700 hover:text-white mr-2`}
                              onClick={() => setEditingBudget(budget)}
                            >
                              Edit
                            </Button>
                            <Popconfirm
                              title="Are you sure you want to delete this budget?"
                              onConfirm={() => handleDeleteBudget(budget.id)}
                              okText="Yes"
                              okType="danger"
                              cancelText="No"
                            >
                              <Button
                                variant="contained"
                                color='error'
                                className='bg-red-500 text-white rounded p-2 hover:bg-red-700 hover:text-white'
                              >
                                Delete
                              </Button>
                            </Popconfirm>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div style={{ textAlign: 'right', padding: '10px' }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={budgets.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetList;