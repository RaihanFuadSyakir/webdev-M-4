// components/BudgetUpdateModal.tsx
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Budget, dbResponse } from '@/utils/type';
import axiosInstance from '@/utils/fetchData';
import { currencySchema } from '@/utils/validation';
import { AxiosError, AxiosResponse } from 'axios';

interface BudgetUpdateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  budget: Budget | null;
  setDataBudgets: React.Dispatch<React.SetStateAction<Budget[] | undefined>>;
}

const BudgetUpdateModal: React.FC<BudgetUpdateModalProps> = ({ isOpen, closeModal, budget, setDataBudgets }) => {
const { date: budgetDate, month, total_budget: budgetTotalBudget, description: budgetDescription } = budget || {};
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedMonth, setSelectedMonth] = useState('');
const [selectedDate, setSelectedDate] = useState('');
const [totalBudget, setTotalBudget] = useState('');
const [description, setDescription] = useState('');

    const handleMonthChange = (event: any) => {
        setSelectedMonth(event.target.value as string);
      };

      const handleUpdate = () => {
        try {
          const validBudget = currencySchema.parse(parseFloat(totalBudget))
          axiosInstance.put('/budget/',{
            date: new Date(selectedDate),
            month: selectedMonth,
            total_budget: validBudget,
            description: description,
          }).then((response : AxiosResponse<dbResponse<Budget>>)=>{
            const data = response.data.data;
            console.log(response.data.msg);
            setDataBudgets((prev)=> [...prev!,data])
          }).catch((err_response : AxiosError<dbResponse<Budget>>) =>{
            console.log(err_response.response?.data.msg);
          })
          closeModal();
        } catch (error) {
          console.error('Error creating budget:', error);
        }
      };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle>Update Budget</DialogTitle>
      <DialogContent>
          <h2>Date</h2>
            <TextField
              type="date"
              name="date"
              value={budgetDate}
              fullWidth
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <h2>Month Selector</h2>
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
            <h2>Total Budget</h2>
            <TextField
              label="Total Budget"
              type="number"
              fullWidth
              margin="normal"
              value={budgetTotalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
            />
            <h2 className='w-[450px]'>Description</h2>
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
        <Button onClick={closeModal} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetUpdateModal;
