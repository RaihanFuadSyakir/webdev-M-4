import React, { useEffect, useState } from 'react';
import { Outcome, Income, dbResponse } from '@/utils/type';
import axiosInstance from '@/utils/fetchData';
import { AxiosResponse } from 'axios';
import numeral from 'numeral';
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

  return Array.from(groupedData.values());
};

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const day = dateObj.getDate();
  return `${month} ${day}, ${year}`;
};

const formatMoney = (value: number) => `Rp ${numeral(value).format('0,0')}`;

const ListRecap = ({ incomes, outcomes }: RecapProps) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(-1); // -1 means no specific month is selected

  const months = Array.from(
    new Set(
      outcomes
        .map((outcome) => new Date(outcome.date).getMonth())
        .concat(incomes.map((income) => new Date(income.date).getMonth()))
    )
  );

  // Sort months in ascending order
  months.sort((a, b) => a - b);

  const groupedData = groupDataByDate(outcomes, incomes);

  const handleMonthChange = (event: SelectChangeEvent) => {
    const selectedMonth = parseInt(event.target.value, 10); // Parse the string to an integer
    setSelectedMonth(selectedMonth);
  };

  const categories = Array.from(
    new Set(outcomes.map((outcome) => outcome.category?.category_name || 'Uncategorized'))
  );

  // Calculate total outcome and total income based on the selected month
  const filteredData = selectedMonth === -1 ? groupedData : groupedData.filter((group) => new Date(group.date).getMonth() === selectedMonth);

  const totalOutcome = filteredData.reduce(
    (total, group) => total + group.outcomes.reduce((sum: number, outcome: Outcome) => sum + outcome.total_outcome, 0),
    0
  );

  const totalIncome = filteredData.reduce(
    (total, group) => total + group.incomes.reduce((sum: number, income: Income) => sum + income.total_income, 0),
    0
  );

  return (
    <div className="">
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              {categories.map((category) => (
                <TableCell key={category} align="center">
                  {category}
                </TableCell>
              ))}
              <TableCell align="center">Total Outcome</TableCell>
              <TableCell align="center">Total Income</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((group, index) => (
              <TableRow key={group.date}>
                <TableCell component="th" scope="row" align="center">
                  {formatDate(group.date)}
                </TableCell>
                {categories.map((category) => (
                  <TableCell key={category} align="center">
                    {formatMoney(group.categories[category] || 0)}
                  </TableCell>
                ))}
                <TableCell align="center">
                  {formatMoney(
                    group.outcomes.reduce((total: number, outcome: Outcome) => total + outcome.total_outcome, 0)
                  )}
                </TableCell>
                <TableCell align="center">
                  {formatMoney(
                    group.incomes.reduce((total: number, income: Income) => total + income.total_income, 0)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New table for Total Outcome and Total Income */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Total Outcome</TableCell>
              <TableCell align="center">Total Income</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">{formatMoney(totalOutcome)}</TableCell>
              <TableCell align="center">{formatMoney(totalIncome)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListRecap;
