"use client"

import Link from "next/link";
import Breadcrumb from "@/components/template/Breadcrumbs/Breadcrumb";
import CardSwitcher from "@/components/Card/CardSwitcher"
import BudgetSelect from "@/components/Budget/BudgetSelect";
import { Metadata } from "next";
import ListBudget from "@/components/Budget/ListBudget";
import { useEffect, useState } from "react";
import { Budget, dbResponse } from "@/utils/type";
import axiosInstance from "@/utils/fetchData";
import { AxiosError, AxiosResponse } from "axios";
import { Button, DialogActions, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { currencySchema } from "@/utils/validation";
import { BACKEND_URL } from "@/constants";

const Budgets = () => {
  const [seed,setSeed] = useState(0);
  const [budgets,setBudgets] = useState<Budget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [date, setDate] = useState('');
  const [total_budget, settotal_budget] = useState('');
  const [description, setDescription] = useState('');

  useEffect(()=>{
    axiosInstance.get('/budgets/')
    .then((response : AxiosResponse<dbResponse<Budget[]>>)=>{
      const data = response.data.data;
      setBudgets(data)
    })
    .catch((err_res : AxiosError<dbResponse<Budget[]>>)=>{
      console.log(JSON.stringify(err_res.response?.data)) 
    })
  },[])

  const handleCreateBudget = () => {
    try {
      const validBudget = currencySchema.parse(parseFloat(total_budget))
      // Make a POST request to your API endpoint with the input data
      axiosInstance.post('/budget/new',{
        date: new Date(date),
        month: selectedMonth,
        total_budget: validBudget,
        description: description,
      }).then((response : AxiosResponse<dbResponse<Budget>>)=>{
        const data = response.data.data;
        console.log(response.data.msg);
        setBudgets((prev)=> [...prev!,data])
      }).catch((err_response : AxiosError<dbResponse<Budget>>) =>{
        console.log(err_response.response?.data.msg);
      })
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const getData = (e:any)=>{
    axiosInstance
      .get(`${BACKEND_URL}/api/budgets/`) // Replace with your actual endpoint
      .then((response : AxiosResponse<dbResponse<Budget[]>>) => {
        const res : dbResponse<Budget[]> = response.data;
        console.log(res,"db")
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
    <div className="flex">
      { <div className="flex-initial w-73 mt-2 p-5 bg-white rounded-sm border border-stroke shadow-default">
          <div>
            <h2>Date</h2>
            <TextField
              type="date"
              name="date"
              value={date}
              fullWidth
              onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
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
          </div>
          <div>
            <h2>Total Budget</h2>
            <TextField
              label="Total Budget"
              type="number"
              fullWidth
              margin="normal"
              value={total_budget}
              onChange={(e) => settotal_budget(e.target.value)} />
          </div>
          <div>
            <h2 className='w-[450px]'>Description</h2>
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button
              onClick={handleCreateBudget}
              variant="contained"
              color="primary"
              className='bg-green-500 text-white rounded p-2 hover:bg-green-700 hover:text-white mr-2'>
              Save
          </Button>
        </div> }
        <div className="flex-1 p-2">
          {budgets && <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default">
            <div className="m-5">
              <h2 className="font-bold text-xl mb-2 text-black">Budget List</h2>
              <ListBudget budgets={budgets} setDataBudgets={setBudgets}/>
            </div>
          </div>}
        </div> 
    </div>
    </>
  );
};

export default Budgets;
