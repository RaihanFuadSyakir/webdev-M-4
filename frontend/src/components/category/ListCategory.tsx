import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/fetchData';
import { BACKEND_URL } from '@/constants';
import { Category, Outcome, dbResponse } from '@/utils/type';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Popconfirm, message } from 'antd';

interface CategoryProps {
  categories: Category[]
  setNewCategories: React.Dispatch<React.SetStateAction<Category[]>>
}
const ListCategories = ({ categories,setNewCategories}: CategoryProps) => {
  const [inputStates, setInputStates] = useState<{isInputVisible: boolean,inputValue:string,error:string}[]>(
    categories.map(()=>({isInputVisible : false,inputValue:'',error:''}))
  );
  useEffect(()=>{
    setInputStates(()=> categories.map(()=>({isInputVisible : false,inputValue:'',error:''})))
  },[categories.length])
  const handleButtonClick = (index : number) => {
    const updatedInputStates = [...inputStates];
    updatedInputStates[index].isInputVisible = true;
    updatedInputStates[index].inputValue = categories[index].category_name;
    setInputStates(()=>updatedInputStates);
  };

  const handleInputChange = (e : any,index:number) => {
    const updatedInputStates = [...inputStates];
    updatedInputStates[index].inputValue = e.target.value;
    setInputStates(()=>updatedInputStates);
  };

  const handleInputBlur = (index : number) => {
    const updatedInputStates = [...inputStates];
    const updatedCategories = [...categories];
    updatedCategories[index].category_name = inputStates[index].inputValue;
    updateCategory(updatedCategories[index].id,inputStates[index].inputValue);
    setNewCategories(()=>updatedCategories);
    updatedInputStates[index].inputValue = ''
    updatedInputStates[index].isInputVisible = false;
    setInputStates(()=>updatedInputStates);
    message.success('Category updated successfully', 5);
  };
  const handleDelete = (index : number) =>{
    const updatedCategories = [...categories];
    const updatedInputStates = [...inputStates];
    deleteCategory(updatedCategories[index].id)
    .then((result)=>{
      if(!result.success){
        updatedInputStates[index].error = result.msg;
        message.success('Category deleted successfully', 5);
      }else{
        updatedCategories.splice(index,1);
        updatedInputStates.splice(index,1);
        message.success('Category deleted successfully', 5);
      }
    })
    setNewCategories(()=>updatedCategories);
    setInputStates(()=>updatedInputStates);
  }
  return (
    <div className='w-full'>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Category Name</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category,index) => (
              <TableRow key={category.id}>
                <TableCell component="th" scope="row" align='center'>
                <div>
                {inputStates[index]?.isInputVisible ? (
                    <input
                      type="text"
                      value={inputStates[index].inputValue}
                      onChange={(e)=>handleInputChange(e,index)}
                      onBlur={()=>handleInputBlur(index)}
                    />
                  ) : (
                    <button onClick={()=>handleButtonClick(index)}>{category.category_name}</button>
                  )}
                </div>
                <div>{inputStates[index]?.error !== '' && inputStates[index]?.error}</div>
                </TableCell>
                <TableCell component="th" scope="row" align='center'>
                <Popconfirm
                      title="Are you sure you want to delete this category?"
                      onConfirm={() => handleDelete(index)}
                      okText="Yes"
                      okType="danger"
                      cancelText="No"
                >
                  <Button 
                    variant="contained" 
                    color="error" 
                    className='bg-red-500 text-white rounded hover:bg-red-700 hover:text-white'
                  >
                    Delete
                  </Button>
                </Popconfirm>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
function updateCategory(categoryid : number,newName:string){
  axiosInstance.patch(`/categories/${categoryid}`,{
    name : newName
  })
  .then((response)=>{
    //
  })
  .catch((err_res : AxiosError<dbResponse<Category>>)=>{
    console.log(JSON.stringify(err_res.response?.data.msg));
  })
}
async function deleteCategory(id : number) {
  let result = { success: false, msg: '' };
  try {
    await axiosInstance.delete(`/categories/${id}`);
    result.success = true;
  } catch (res_err : any) {
    const {response} = res_err;
    result.msg = response.data.msg;
  }

  return result;
}
export default ListCategories;
