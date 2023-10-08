"use client"
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
interface props {
    isExist: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }
export default function ButtonCreateCategory({isExist,onClick} : props) {

  return (
    <IconButton aria-label="Add" className='bg-blue-700 hover:bg-blue-500 m-2' disabled={isExist} onClick={onClick}>
        <AddIcon fontSize="inherit"/>
    </IconButton>
  )
}
