
import React, { useEffect, useState } from 'react';
import { Outcome, Income, dbResponse } from '@/utils/type';
import axiosInstance from '@/utils/fetchData';
import { AxiosResponse } from 'axios';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Stack,
  Chip,
} from '@mui/material';

interface RecapProps {
  outcomes: Outcome[];
  incomes: Income[];
}

const groupDataByDate = (outcomes: Outcome[], incomes: Income[]) => {
  const groupedData = new Map();
  outcomes.forEach((outcome) => {
    const date = outcome.date;
    if (!groupedData.has(date)) {
      groupedData.set(date, { date, outcomes: [], incomes: [], categories: {} });
    }
    groupedData.get(date).outcomes.push(outcome);

    const categoryId = outcome.category?.category_name || 'Uncategorized';
    if (!groupedData.get(date).categories[categoryId]) {
      groupedData.get(date).categories[categoryId] = 0;
    }
    groupedData.get(date).categories[categoryId] += outcome.total_outcome;
  });

  incomes.forEach((income) => {
    const date = income.date;
    if (!groupedData.has(date)) {
      groupedData.set(date, { date, outcomes: [], incomes: [], categories: {} });
    }
    groupedData.get(date).incomes.push(income);
  });

  // Sort the data by date in ascending order
  return Array.from(groupedData.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear().toString().slice(-2); // Get the last 2 digits of the year
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1 and ensure it's two digits
    const day = dateObj.getDate().toString().padStart(2, '0'); // Ensure day is two digits
    return `${day}/${month}/${year}`;
  };
  
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

const ListRecap = ({ incomes, outcomes }: RecapProps) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(-1);

  const months = Array.from(
    new Set(
      outcomes
        .map((outcome) => new Date(outcome.date).getMonth())
        .concat(incomes.map((income) => new Date(income.date).getMonth()))
    )
  );

  months.sort((a: number, b: number) => a - b);

  const groupedData = groupDataByDate(outcomes, incomes);

  const handleMonthChange = (event: SelectChangeEvent) => {
    const selectedMonth = parseInt(event.target.value, 10);
    setSelectedMonth(selectedMonth);
  };

  const categories = Array.from(
    new Set(outcomes.map((outcome) => outcome.category?.category_name || 'Uncategorized'))
  );

  // Define a type for the accumulator object
  type CategoryAccumulator = {
    [category: string]: number;
  };

  const filteredData = selectedMonth === -1 ? groupedData : groupedData.filter((group) => new Date(group.date).getMonth() === selectedMonth);

  const totalOutcome = filteredData.reduce(
    (total, group) =>
      total +
      group.outcomes.reduce((sum: number, outcome: Outcome) => sum + outcome.total_outcome, 0),
    0
  );

  const totalIncome = filteredData.reduce(
    (total, group) =>
      total +
      group.incomes.reduce((sum: number, income: Income) => sum + income.total_income, 0),
    0
  );

  const totalSavings = totalIncome - totalOutcome;

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value.toString()),
    },
    ...categories.map((category) => ({
      field: category,
      headerName: category,
      width: 150,
      valueFormatter: (params: GridValueFormatterParams) => formatRupiah(params.value as number),
    })),
    {
      field: 'totalOutcome',
      headerName: 'Total Outcome',
      width: 150,
      valueFormatter: (params: GridValueFormatterParams) => formatRupiah(params.value as number),
    },
    {
      field: 'totalIncome',
      headerName: 'Total Income',
      width: 150,
      valueFormatter: (params: GridValueFormatterParams) => formatRupiah(params.value as number),
    },
    {
      field: 'totalSavings',
      headerName: 'Savings',
      width: 150,
      valueFormatter: (params: GridValueFormatterParams) => formatRupiah(params.value as number),
    },
  ];

  const rows = filteredData.map((group) => {
    // Initialize the accumulator with an empty object
    const acc: CategoryAccumulator = {};
  
    // Fill the accumulator with category data
    categories.forEach((category) => {
      acc[category] = group.categories[category] || 0;
    });
  
    return {
      id: group.date,
      date: group.date,
      ...acc, // Spread the accumulator object
      totalOutcome: group.outcomes.reduce((total: number, outcome: Outcome) => total + outcome.total_outcome, 0),
      totalIncome: group.incomes.reduce((total: number, income: Income) => total + income.total_income, 0),
      totalSavings:
        group.incomes.reduce((total: number, income: Income) => total + income.total_income, 0) -
        group.outcomes.reduce((total: number, outcome: Outcome) => total + outcome.total_outcome, 0),
    };
  });
  return (
    <div className="max-w-6xl">
      <div className='flex pb-5 justify-between'>
        <FormControl>
          <Select value={selectedMonth.toString()} onChange={handleMonthChange}>
            <MenuItem value={-1}>All Months</MenuItem>
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {new Date(2023, month, 1).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2} className='p-3'>
          <span className='pl-2'>Total Outcome</span><Chip label={formatRupiah(totalOutcome)} color="error" />
          <span className='pl-2'>Total Income</span><Chip label={formatRupiah(totalIncome)} color="success" />
          <span className='pl-2'>Total Savings</span><Chip label={formatRupiah(totalSavings)} color="primary" />
        </Stack>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default ListRecap;
