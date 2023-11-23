import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { Outcome, dbResponse } from '@/utils/type';
import { AxiosError, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination'; 
import Categories from '@/app/(logged)/categories/page';
import Outcomes from '@/app/(logged)/outcomes/page';
import WalletSelect from '../wallet/WalletSelect';
import CategorySelect from '../category/CategorySelect';
import {format} from 'date-fns';
import numeral from 'numeral';
import { Popconfirm, message } from 'antd';

interface OutcomeProps {
  outcomes: Outcome[];
  setOutcomes: React.Dispatch<React.SetStateAction<Outcome[]>>;
}

const ListOutcomes = ({ outcomes, setOutcomes }: OutcomeProps) => {
  const [editStates, setEditStates] = useState(
    outcomes.map((outcome) => ({
      isEditing: false,
      id: outcome.id,
      date: outcome.date,
      total_outcome: outcome.total_outcome,
      description: outcome.description,
    }))
  );
  const [newWalletId, setNewWalletId] = useState(0);
  const [newCategoryId, setNewCategoryId] = useState(0);
  const [page, setPage] = useState(0);  
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setEditStates(() => (
      outcomes.map((outcome) => ({
        isEditing: false,
        id: outcome.id,
        date: outcome.date,
        total_outcome: outcome.total_outcome,
        description: outcome.description,
      }))
    ))
  }, [outcomes.length])

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (index: number) => {
    const newEditStates = [...editStates];
    const updatedOutcomes = [...outcomes];
    deleteOutcome(newEditStates[index].id);
    newEditStates.splice(index, 1);
    updatedOutcomes.splice(index, 1);
    setEditStates(newEditStates);
    setOutcomes(updatedOutcomes);
    message.success('Outcome deleted successfully', 5);
  }

  const enableEdit = (index: number) => {
    const updatedStates = [...editStates];
    updatedStates[index].isEditing = true;
    setEditStates(updatedStates)
  };

  const handleCancelEdit = (index: number) => {
    const updatedStates = [...editStates];
    updatedStates[index].isEditing = false;
    setEditStates(updatedStates)
  };
  const handleDateOnChange = (index: number, newValue: string) => {
    const newEditStates = [...editStates];
    newEditStates[index].date = newValue;
    setEditStates(newEditStates);
  }
  const handleTotalOutcomeOnChange = (index: number, newValue: string) => {
    try {
      const parsedNominal = parseFloat(newValue)
      const newEditStates = [...editStates];
      newEditStates[index].total_outcome = parsedNominal;
      setEditStates(newEditStates);
    } catch (error) {
      //
    }
  }
  const handleDescriptionOnChange = (index: number, newValue: string) => {
    const newEditStates = [...editStates];
    newEditStates[index].description = newValue;
    setEditStates(newEditStates);
  }
  const handleSaveEdit = (index: number) => {
    // Construct the edited outcome object
    const newOutcome = editStates[index];
    const editedOutcomeData = {
      date: new Date(newOutcome.date),
      total_outcome: newOutcome.total_outcome,
      wallet_id: newWalletId,
      description: newOutcome.description,
      category_id: newCategoryId
    };

    // Send a PUT or PATCH request to update the outcome on the server
    axiosInstance
      .put(`/outcomes/${newOutcome.id}`, editedOutcomeData)
      .then((response: AxiosResponse<dbResponse<Outcome>>) => {
        console.log('edit success');
        const newData = response.data.data;
        const updatedOutcomes = [...outcomes];
        updatedOutcomes[index] = newData;
        setOutcomes(updatedOutcomes);
        const updatedEditStates = [...editStates];
        updatedEditStates[index].isEditing = false;
        setEditStates(updatedEditStates);
        console.log(editStates[index].isEditing);
      })
      .catch((res_err: AxiosError<dbResponse<Outcome>>) => {
        console.log(JSON.stringify(res_err.response?.data));
      });

  }

  return (
    <div className="text-center">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Total Outcome</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Wallet</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outcomes.map((outcome, index) => (
              <TableRow key={outcome.id}>
                <TableCell component="th" scope="row" align="center">
                  {editStates[index]?.isEditing ? (
                    <TextField
                      type="date"
                      name="date"
                      value={editStates[index].date}
                      onChange={(e) => { handleDateOnChange(index, e.target.value) }}
                    />
                    ) : (
                    format(new Date(outcome.date), 'dd/MM/yyyy'))
                  }
                </TableCell>
                <TableCell align="center">
                  {editStates[index]?.isEditing ? (
                    <TextField
                      type="number"
                      value={editStates[index].total_outcome}
                      onChange={(e) =>
                        handleTotalOutcomeOnChange(index, e.target.value)
                      }
                    />
                  ) : (
                    `Rp. ${numeral(outcome.total_outcome).format('0,0')}`
                  )}
                </TableCell>
                <TableCell align="center">
                  {editStates[index]?.isEditing ? (
                    <TextField
                      type="text"
                      value={editStates[index].description}
                      onChange={(e) => handleDescriptionOnChange(index, e.target.value)}
                    />
                  ) : (
                    outcome.description
                  )}
                </TableCell>
                <TableCell align="center">
                  {editStates[index]?.isEditing ? (
                    <CategorySelect setSelectedCategory={setNewCategoryId} />
                  ) : (
                    outcome.category?.category_name)
                  }</TableCell>
                <TableCell align="center">
                  {editStates[index]?.isEditing ?
                    (<WalletSelect setSelectedWallet={setNewWalletId} />
                    ) : (
                      outcome.wallet?.wallet_name)
                  }</TableCell>
                <TableCell className='flex justify-evenly'>
                  {editStates[index]?.isEditing ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleSaveEdit(index)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        color='error'
                        onClick={() => handleCancelEdit(index)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Popconfirm
                        title="Are you sure you want to delete this outcome?"
                        onConfirm={() => handleDelete(index)}
                        okText="Yes"
                        okType="danger"
                        cancelText="No"
                      >
                        <Button
                          variant="contained"
                          color="error"
                          className='bg-red-500 text-white rounded hover:bg-red-700 hover:text-white mr-1'
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                      <Button
                        variant="contained"
                        color="primary"
                        className="bg-blue-500 text-white rounded hover:bg-blue-700 hover:text-white ml-1"
                        onClick={() => enableEdit(index)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={outcomes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
}

function deleteOutcome(id: number) {
  axiosInstance
    .delete(`/outcome/delete/${id}`)
    .then(() => {
      console.log('delete success');
    })
    .catch((res_err: AxiosError<dbResponse<Outcome>>) => {
      console.log(JSON.stringify(res_err.response?.data));
    });
}

export default ListOutcomes;
