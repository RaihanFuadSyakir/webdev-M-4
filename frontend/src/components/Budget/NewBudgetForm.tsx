"use client"

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { Budget, dbResponse } from '@/utils/type';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { message } from 'antd';
import { InputAdornment } from "@mui/material";
import CategorySelect from "@/components/category/CategorySelect";
import numeral from "numeral";
import { BACKEND_URL } from "@/constants";

interface BudgetFormProps {
  onBudgetAdded: () => void;
  onBudgetUpdated: () => void;
  selectedBudget: Budget | null;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onBudgetAdded, onBudgetUpdated, selectedBudget }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [date, setDate] = useState('');
  const [total_budget, setTotalBudget] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);

  const numeralTotalBudget = numeral(total_budget).format('0,0');

  useEffect(() => {
    if (selectedBudget) {
      // Populate form fields when in update mode
      setSelectedMonth(`${selectedBudget.year}-${selectedBudget.month.toString().padStart(2, '0')}`);
      setDate(`${selectedBudget.year}-${selectedBudget.month.toString().padStart(2, '0')}`);
      setTotalBudget(selectedBudget.total_budget || 0);
      setDescription(selectedBudget.description || '');
      setSelectedCategory(selectedBudget.category_id || 0);
    }
  }, [selectedBudget]);

  const handleTotalBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = numeral(e.target.value).value();

    if (!isNaN(newValue!)) {
      setTotalBudget(newValue!);
    }
  }

  const handleFormSubmit = async () => {
    try {
      const splitDate = date.split('-');
      const validBudget = numeralTotalBudget.replace(/[^a-zA-Z0-9]/g, '');

      const data = {
        month: parseInt(splitDate[1]),
        year: parseInt(splitDate[0]),
        total_budget: parseFloat(validBudget),
        description: description,
        category_id: selectedCategory,
      };

      if (selectedBudget) {
        // Update existing budget
        const updatedBudgetData = {
          ...selectedBudget,
          ...data,
        };

        await axiosInstance.put(`/budget/${selectedBudget.id}`, updatedBudgetData);
        onBudgetUpdated();
        message.success('Budget updated successfully', 5);
      } else {
        // Create new budget
        const response = await axiosInstance.post('/budget/new', data);
        const newBudget = response.data.data;
        onBudgetAdded();
        message.success('Budget added successfully', 5);
      }

      // Reset form fields
      setSelectedMonth('');
      setDate('');
      setTotalBudget(0);
      setDescription('');
      setSelectedCategory(0);

    } catch (error) {
      console.error('Error creating/updating budget:', error);
    }
  };

  return (
    <div className="flex">
        <div className="flex-initial w-73 mt-2 p-5 bg-white rounded-sm border border-stroke shadow-default">
            <div>
                <h2 className="mb-2">Date</h2>
                <TextField
                    type="month"
                    name="date"
                    value={date}
                    fullWidth
                    onChange={(e) => setDate(e.target.value)} 
                    />
            </div>
            <div className="my-2">
                <h2 className="mb-2">Category</h2>
                <CategorySelect setSelectedCategory={setSelectedCategory} />
            </div>
            <div>
                <h2>Total Budget</h2>
                <TextField
                    label="Total Budget"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={numeralTotalBudget}
                    InputProps={{
                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                    }}
                    onChange={handleTotalBudgetChange}
                />
            </div>
            <div>
                <h2 className='w-[450px]'>Description</h2>
                <TextField
                multiline
                rows={4}
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button
                className="bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
                onClick={handleFormSubmit}
            >
                {selectedBudget ? 'Update Budget' : 'Add Budget'}
            </Button>
        </div>
    </div>
  );
};

export default BudgetForm;
