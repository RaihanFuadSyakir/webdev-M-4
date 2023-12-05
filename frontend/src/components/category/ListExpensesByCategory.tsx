import React, { useState } from 'react';
import { Income, Outcome } from '@/utils/type';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import { Chip, FormControl, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface CategoryListProps {
  incomes: Income[];
  outcomes: Outcome[];
}

const ListCategory: React.FC<CategoryListProps> = ({ incomes, outcomes }) => {
  const categories = Array.from(
    new Set(outcomes.map((outcome) => (outcome.category && outcome.category.category_name) || 'Uncategorized'))
  );

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const totalIncome = incomes.reduce((total, income) => total + income.total_income, 0);

  const columns: GridColDef[] = [
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'totalIncome', headerName: 'Total Income', width: 150, valueFormatter: (params: GridValueFormatterParams) => totalIncome && formatRupiah(totalIncome) },
    { field: 'totalOutcome', headerName: 'Total Outcome', width: 150, valueFormatter: (params: GridValueFormatterParams) => params.value && formatRupiah(params.value as number) },
    { field: 'totalSavings', headerName: 'Savings', width: 150, valueFormatter: (params: GridValueFormatterParams) => params.value && formatRupiah(params.value as number) },
  ];

  const rows = categories.map((category) => {
    const categoryOutcomes = outcomes.filter((outcome) => (outcome.category && outcome.category.category_name) === category);

    return {
      id: category,
      category,
      totalIncome,
      totalOutcome: categoryOutcomes.reduce((total, outcome) => total + outcome.total_outcome, 0),
      totalSavings: totalIncome - categoryOutcomes.reduce((total, outcome) => total + outcome.total_outcome, 0),
    };
  });

  return (
    <div className="max-w-6xl">
      <div className='flex pb-5 justify-between'>
        {/* Removed the month and filter logic */}
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

export default ListCategory;
