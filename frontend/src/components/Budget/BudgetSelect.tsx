"use client"
// components/BudgetSelect.tsx
import { BACKEND_URL } from '@/constants';
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import Modal from './BudgetModal';
import axios from 'axios'; // Import Axios

const BudgetSelect: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [date, setDate] = useState('');
  const [total_budget, settotal_budget] = useState('');
  const [description, setDescription] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateBudget = async () => {
    try {
      // Make a POST request to your API endpoint with the input data
      const response = await axios.post(`${BACKEND_URL}/api/budget/new`, {
        date: date,
        month: selectedMonth,
        total_budget: total_budget,
        description: description,
      });

      console.log('Budget created successfully:', response.data);
      closeModal();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMonth(event.target.value as string);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={openModal}>
        Create Budget
      </Button>

      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <DialogTitle>Create Budget</DialogTitle>
          <DialogContent>
            <TextField
              label="Date"
              type="date"
              fullWidth
              margin="normal"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="month-select-label">Month Selector</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={handleMonthChange}
                label="Month Selector"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="January">January</MenuItem>
                <MenuItem value="February">February</MenuItem>
                <MenuItem value="March">March</MenuItem>
                <MenuItem value="April">April</MenuItem>
                <MenuItem value="May">May</MenuItem>
                <MenuItem value="June">June</MenuItem>
                <MenuItem value="July">July</MenuItem>
                <MenuItem value="August">August</MenuItem>
                <MenuItem value="September">September</MenuItem>
                <MenuItem value="October">October</MenuItem>
                <MenuItem value="November">November</MenuItem>
                <MenuItem value="December">December</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Total Budget"
              type="number"
              fullWidth
              margin="normal"
              value={total_budget}
              onChange={(e) => settotal_budget(e.target.value)}
            />
            
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateBudget} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Modal>
      )}
    </div>
  );
};

export default BudgetSelect;
