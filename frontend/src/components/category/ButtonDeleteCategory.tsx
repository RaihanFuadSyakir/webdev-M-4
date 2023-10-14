"use client"
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
interface props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
export default function ButtonDeleteCategory({onClick} : props) {
  return (
    <IconButton aria-label="delete" className='m-2' onClick={onClick}>
        <DeleteIcon fontSize="inherit"/>
    </IconButton>
    
  )
}
