"use client"

import Link from "next/link";
import Breadcrumb from "@/components/template/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import ListBudget from "@/components/Budget/ListBudget";
import { useEffect, useState } from "react";
import { Budget, dbResponse } from "@/utils/type";
import axiosInstance from "@/utils/fetchData";
import { AxiosError, AxiosResponse } from "axios";
import { Button, DialogActions, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { currencySchema } from "@/utils/validation";
import { BACKEND_URL } from "@/constants";
import DateTable from "@/components/Budget/DateTable";
import CategorySelect from "@/components/category/CategorySelect";
import numeral from "numeral";
import { message } from "antd";

const Budgets = () => {
  const [seed, setSeed] = useState(0);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [date, setDate] = useState('');
  const [total_budget, settotal_budget] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const numeralTotalBudget = numeral(total_budget).format('0,0');
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    axiosInstance.get('/budgets/')
      .then((response: AxiosResponse<dbResponse<Budget[]>>) => {
        const data = response.data.data;
        setBudgets(data);
      })
      .catch((err_res: AxiosError<dbResponse<Budget[]>>) => {
        console.log(JSON.stringify(err_res.response?.data));
      })
  }, [])

  const fetchBudgets = () => {
    axiosInstance
      .get('/budgets/')
      .then((response) => {
        const data = response.data.data;
        setBudgets(data);
      })
      .catch((err_res) => {
        console.log(JSON.stringify(err_res.response?.data));
      });
  };

  const handleCreateOrUpdateBudget = () => {
    try {
      const validBudget = currencySchema.parse(total_budget);
      const splitDate = date.split('-');
  
      if (isUpdateMode) {
        // Update existing budget
        const updatedBudgetData = {
          ...selectedBudget,
          month: parseInt(splitDate[1]),
          year: parseInt(splitDate[0]),
          total_budget: validBudget,
          description: description,
          category_id: selectedCategory,
        };
  
        // Simulated API call to update the budget
        axiosInstance
          .put(`/budget/${selectedBudget?.id}`, updatedBudgetData)
          .then((response) => {
            console.log('Budget updated successfully:', response.data);
            // Update the budget in the UI or refetch the data
            // For simplicity, we're just logging the response
            // You might want to update the state or refetch the data here
            fetchBudgets(); // Refetch the data after update
            setSelectedBudget(null); // Clear selectedBudget after update
            setIsUpdateMode(false);
          })
          .catch((error) => {
            console.error('Error updating budget:', error);
          });
      } else {
        // Create new budget
        axiosInstance
          .post('/budget/new', {
            month: parseInt(splitDate[1]),
            year: parseInt(splitDate[0]),
            total_budget: validBudget,
            description: description,
            category_id: selectedCategory,
          })
          .then((response) => {
            const data = response.data.data;
            console.log(response.data.msg);
            setBudgets((prev) => [...prev!, data]);
            setIsUpdateMode(false);
            message.success('Budget added successfully', 5);
          })
          .catch((err_response) => {
            console.log(err_response.response?.data.msg);
          });
      }
  
      // Reset the form after handling the update or create
      setDate('');
      settotal_budget(0);
      setDescription('');
      setSelectedCategory(0);

    } catch (error) {
      console.error('Error creating/updating budget:', error);
    }
  };

  const handleTotalBudgetChange = (e : any) => {
    const newValue = numeral(e.target.value).value();

    if(!isNaN(newValue!)){
      settotal_budget(newValue!);
    }
  }

  const getData = (e: any) => {
    axiosInstance
      .get(`${BACKEND_URL}/api/budgets/`) // Replace with your actual endpoint
      .then((response: AxiosResponse<dbResponse<Budget[]>>) => {
        const res: dbResponse<Budget[]> = response.data;
        console.log(res, "db")
        setBudgets([]);
      })
      .catch((error) => {
        console.error('Failed to fetch outcomes:', error);
      });
  }
  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value as string);
  };

  return (
    <>
      <Breadcrumb pageName="Budget" />
      <div className="sm:flex">
        {<div className="flex-initial sm:w-73 mt-2 p-5 bg-white rounded-sm border border-stroke shadow-default">
          <div>
            <h2 className="mb-2">Date</h2>
            <TextField
              type="month"
              name="date"
              value={date}
              fullWidth
              onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="my-2">
            <h2 className="mb-2">Category</h2>
            <CategorySelect setSelectedCategory={setSelectedCategory} />
          </div>
          <div>
            <h2>Total Budget</h2>
            <TextField
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
            onClick={handleCreateOrUpdateBudget}
            variant="contained"
            color="primary"
            className='bg-green-500 text-white rounded p-2 hover:bg-green-700 hover:text-white mr-2'>
            {isUpdateMode ? 'Update' : 'Save' }
          </Button>
        </div>}
        <div className="flex-1 p-2">
          {budgets && <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default">
            <div className="m-5">
              <h2 className="font-bold text-xl mb-2 text-black">Budget List</h2>
              <ListBudget 
                budgets={budgets}
                setDataBudgets={setBudgets}
                setSelectedBudget={setSelectedBudget}  
                setSelectedMonth={setSelectedMonth}
                setTotalBudget={settotal_budget}
                setDescription={setDescription}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </div>}
        </div>
      </div>
    </>
  );
};

export default Budgets;
