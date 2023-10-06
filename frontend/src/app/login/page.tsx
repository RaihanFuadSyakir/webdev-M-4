// Login.tsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/fetchData';
import { User, dbResponse } from '@/utils/type'
import { loginSchema } from '@/utils/validation';
import { ZodError } from 'zod';
import { Button, CircularProgress, TextField } from '@mui/material';
import { AxiosError, AxiosResponse } from 'axios';
const Login: React.FC = () => {
  const route = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(['','','']);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading,setLoading] = useState(false);
  const router = useRouter();
  const handleOnChange = (event : any) =>{
    const {name,value} = event.target;
    if(name === 'identifier'){
      setIdentifier(value);
    }
    if(name === 'password'){
      setPassword(value);
    }
  }
  const handleLogin = async () => {
    try {
      const formData = loginSchema.parse({ identifier, password });
      axiosInstance
    .post('/users/login', formData)
    .then((response) => {
      const removeError = ['','','']
      setErrors(removeError);
      router.push('/dashboard');
    })
    .catch((error : AxiosError<dbResponse<User>>) => {
      const updateError = [...errors]
      const res : dbResponse<User> | undefined= error.response?.data;
      updateError[2] = res!.msg;
      setErrors(updateError);
    });
    } catch (error : any) {
      if (error instanceof ZodError) {
        // Access the error messages for each field
        const errorMessages = ['','']
        const identifierError = error.issues.find((issue) => issue.path[0] === 'identifier');
        const passwordError = error.issues.find((issue) => issue.path[0] === 'password');
        // You can use the error messages as needed
        if (identifierError) {
          // Set the error messages in the state array
          errorMessages[0] = identifierError.message;
        }
        if (passwordError) {
          errorMessages[1] = passwordError.message;
        }
        setErrors(errorMessages);
        };
        
      }
    }

  return (
    <div className=' text-black flex items-center justify-center h-screen'>
      <div className='flex flex-col h-72 w-72 shadow-md rounded'>
      <h2 className="text-3xl font-semibold text-center text-indigo-600">Login</h2>
      <TextField
          required
          error={errors[0] !== ''}
          id={errors[0] !== '' ? "outlined-required" : "outlined-error-helper-text"}
          name = "identifier"
          label="username/email"
          defaultValue=""
          onChange={handleOnChange}
          helperText={errors[0] !== '' && errors[0]}
          className='m-2'
        />
        <TextField
          required
          error={errors[1] !== ''}
          id={errors[1] !== '' ? "outlined-required" : "outlined-error-helper-text"}
          name = "password"
          label="Password"
          type="password"
          defaultValue=""
          helperText={errors[1] !== '' && errors[1]}
          onChange={handleOnChange}
          className='m-2'
        />
        <div className='flex items-center justify-center'>
        <Button 
          variant="contained" 
          onClick={handleLogin}
          className='bg-cyan-700'
          disabled={isLoading}
          >
          {isLoading ? <CircularProgress color='primary' /> : "Login"}
          </Button>
        </div>
        {errors[2] !== '' && 
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{errors[2]}</span>
          </div>
        }
      </div>
    </div>
  );
};

export default Login;
