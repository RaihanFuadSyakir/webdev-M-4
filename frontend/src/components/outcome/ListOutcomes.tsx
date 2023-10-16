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

interface OutcomeProps {
  outcomes: Outcome[];
}

const ListOutcomes = ({ outcomes }: OutcomeProps) => {
  const [editedOutcome, setEditedOutcome] = useState<Outcome | null>(null);
  const [editedTotalOutcome, setEditedTotalOutcome] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState<string>('');

  const handleDelete = (selectedOption: number) => {
    deleteOutcome(selectedOption);
  };

  const handleEdit = (outcome: Outcome) => {
    setEditedOutcome(outcome);
    setEditedTotalOutcome(outcome.total_outcome);
    setEditedDescription(outcome.description);
  };

  const handleCancelEdit = () => {
    setEditedOutcome(null);
  };

  const handleSaveEdit = () => {
    if (editedOutcome) {
      // Construct the edited outcome object
      const editedOutcomeData = {
        id: editedOutcome.id,
        total_outcome: editedTotalOutcome,
        description: editedDescription,
      };

      // Send a PUT or PATCH request to update the outcome on the server
      axiosInstance
        .put(`/outcome/${editedOutcome.id}`, editedOutcomeData)
        .then(() => {
          console.log('edit success');
          setEditedOutcome(null); // Close the edit form after a successful update
        })
        .catch((res_err: AxiosError<dbResponse<Outcome>>) => {
          console.log(JSON.stringify(res_err.response?.data));
        });
    }
  };

  return (
    <div className="max-w-2xl">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
            {outcomes.map((outcome) => (
              <TableRow key={outcome.id}>
                <TableCell component="th" scope="row">
                  {outcome.date}
                </TableCell>
                <TableCell>
                  {editedOutcome === outcome ? (
                    <TextField
                      type="number"
                      value={editedTotalOutcome}
                      onChange={(e) =>
                        setEditedTotalOutcome(parseFloat(e.target.value))
                      }
                    />
                  ) : (
                    outcome.total_outcome
                  )}
                </TableCell>
                <TableCell>
                  {editedOutcome === outcome ? (
                    <TextField
                      type="text"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                  ) : (
                    outcome.description
                  )}
                </TableCell>
                <TableCell>{outcome.category?.category_name}</TableCell>
                <TableCell>{outcome.wallet?.wallet_name}</TableCell>
                <TableCell>
                  {editedOutcome === outcome ? (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(outcome.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(outcome)}
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
      </TableContainer>
    </div>
  );
};

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
