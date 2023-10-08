"use client"
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
interface props {
  isExist: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
export default function ButtonDeleteCategory({isExist,onClick} : props) {
  return (
    <IconButton aria-label="delete" className='bg-red-700 hover:bg-red-500 m-2' disabled={!isExist} onClick={onClick}>
        <DeleteIcon fontSize="inherit"/>
    </IconButton>
    
  )
}
