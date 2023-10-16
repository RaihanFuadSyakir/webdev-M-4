// ListIncomes.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Income, dbResponse } from '@/utils/type';

import { Axios, AxiosError, AxiosResponse } from 'axios';


import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField'; // Import the TextField component
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import WalletSelect from '@/components/wallet/WalletSelect';

interface Props{
  incomes : Income[]
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
}
const ListIncomes = ({incomes,setIncomes} : Props) => {
  const [editStates,setEditStates] = useState(
    incomes.map((income)=>({
      isEditing : false,
      id : income.id,
      date : income.date,
      total_income : income.total_income,
      wallet_id : income.wallet_id,
      description : income.description
    }))
  )
  const [newWalletId,setNewWalletId] = useState(0);
  const handleDelete = (index: number) => {
    const newEditStates = [...editStates];
    const updatedIncomes = [...incomes];
    deleteIncome(newEditStates[index].id);
    newEditStates.splice(index,1);
    updatedIncomes.splice(index,1);
    setEditStates(newEditStates);
    setIncomes(updatedIncomes);
  }
  useEffect(()=>{
    setEditStates(()=>(
      incomes.map((income)=>({
        isEditing : false,
        id : income.id,
        date : income.date,
        total_income : income.total_income,
        wallet_id : income.wallet_id,
        description : income.description
      }))
    ))
  },[incomes.length])
  const enableEdit = (index : number) => {
    const newEditStates = [...editStates];
    newEditStates[index].isEditing = true;
    setEditStates(newEditStates);
  }

  const handleCancelEdit = (index : number) => {
    const newEditStates = [...editStates];
    newEditStates[index].isEditing = false;
    setEditStates(newEditStates);
  }

  const handleDateOnChange = (index : number,newValue : string) =>{
    const newEditStates = [...editStates];
    newEditStates[index].date = newValue;
    setEditStates(newEditStates);
  }
  const handleTotalIncomeOnChange = (index : number,newValue : string) =>{
    try {
      const parsedNominal = parseFloat(newValue)
      const newEditStates = [...editStates];
      newEditStates[index].total_income = parsedNominal;
      setEditStates(newEditStates);
    } catch (error) {
      //
    }
    
  }
  const handleDescriptionOnChange = (index : number,newValue : string) =>{
    const newEditStates = [...editStates];
    newEditStates[index].description = newValue;
    setEditStates(newEditStates);
  }
  const handleSaveEdit = (index : number) => {
      // Construct the edited income object
      const newIncome = editStates[index];
      const editedIncomeData = {
        date: new Date(newIncome.date),
        total_income: newIncome.total_income,
        wallet_id: newWalletId,
        description: newIncome.description,
      };
      // Send a PUT or PATCH request to update the income on the server
      axiosInstance.put(`/incomes/${newIncome.id}`, editedIncomeData)
        .then(() => {
          console.log("edit success");
          const newEditStates = [...editStates];
          const updatedIncomes = [...incomes];
          updatedIncomes[index].date = newIncome.date;
          updatedIncomes[index].total_income = newIncome.total_income;
          updatedIncomes[index].wallet_id = newWalletId;
          updatedIncomes[index].description = newIncome.description;
          setIncomes(updatedIncomes);
          newEditStates[index].isEditing = false;
          setEditStates(newEditStates);
        })
        .catch((res_err: AxiosError<dbResponse<Income>>) => {
          console.log(JSON.stringify(res_err.response?.data));
        });
  }

  return (
    <div className=''>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Total Income</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Wallet</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes.map((income,index) => (
              <TableRow key={income.id}>
                <TableCell component="th" scope="row">
                  {editStates[index]?.isEditing ? (
                    <TextField
                      type="date"
                      name="date"
                      value={editStates[index].date}
                      onChange={(e)=>{handleDateOnChange(index,e.target.value)}}
                    />) : 
                    income.date
                  }
                </TableCell>

                <TableCell>
                {editStates[index]?.isEditing ? (
                  <TextField
                    type="number"
                    value={editStates[index].total_income}
                    onChange={(e) => handleTotalIncomeOnChange(index,e.target.value)}
                  />
                ) : (
                  income.total_income
                )}
                </TableCell>
                <TableCell>
                {editStates[index]?.isEditing ? (
                  <TextField
                    type="text"
                    value={editStates[index].description}
                    onChange={(e) => handleDescriptionOnChange(index,e.target.value)}
                  />
                ) : (
                  income.description
                )}
                </TableCell>
                <TableCell>
                  {editStates[index]?.isEditing ? (
                    <WalletSelect setSelectedWallet={setNewWalletId} />
                    ) : 
                    (income.wallet?.wallet_name)}
                </TableCell>
                <TableCell>
                {editStates[index]?.isEditing ? (
                    <>
                      <Button variant="outlined" color="primary" onClick={()=>handleSaveEdit(index)}>
                        Save
                      </Button>
                      <Button variant="outlined" onClick={()=>{handleCancelEdit(index)}}>
                        Cancel
                      </Button>
                    </>
                ) : (
                  <>
                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(index)}>
                      Delete
                    </Button>
                    <Button variant="outlined" color="primary" onClick={()=>enableEdit(index)}>
                      Edit
                    </Button>
                  </>
                )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

function deleteIncome(id: number) {
  axiosInstance.delete(`/income/delete/${id}`)
    .then(() => {
      console.log("delete success");
    })
    .catch((res_err: AxiosError<dbResponse<Income>>) => {
      console.log(JSON.stringify(res_err.response?.data));
    })
}

export default ListIncomes;
