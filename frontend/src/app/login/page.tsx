// Login.tsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/fetchData';
import { User, dbResponse } from '@/utils/type'
import { loginSchema } from '@/utils/validation';
import { ZodError } from 'zod';
import { TextField } from '@mui/material';
import { AxiosError, AxiosResponse } from 'axios';
const Login: React.FC = () => {
  const route = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(['','','']);
  const [users, setUsers] = useState<User[]>([]);
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
  const testFetch = () => {
    axiosInstance
    .post('/users', {
      identifier,
      password,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      // The error interceptor defined above will handle errors here
    });

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
        const errorMessages = Array(2).fill(''); // Initialize an array with empty strings
      
        error.errors.forEach((validationError) => {
          // Check the path of each error and set the corresponding index in errorMessages
          if (validationError.path[0] === 'identifier') {
            errorMessages[0] = 'Identifier must not empty'
          } else if (validationError.path[0] === 'password') {
            errorMessages[1] = 'Password must not empty';
          }
        });
        // Set the error messages in the state array
        setErrors(errorMessages);
      }
    }
    
  };

  return (
    <div className=' text-black flex items-center justify-center h-screen'>
      <div className='flex flex-col h-56 w-56 shadow-md'>
      <h2 className="text-3xl font-semibold text-center text-indigo-600">Login</h2>
      <TextField
          required
          error={errors[0] !== ''}
          id={errors[0] !== '' ? "outlined-required" : "outlined-error-helper-text"}
          name = "identifier"
          label="Identifier"
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
        <button onClick={handleLogin}>Login</button>
        <button onClick={testFetch}>Fetch</button>
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
