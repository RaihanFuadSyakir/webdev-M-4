"use client"
// Registration.tsx
import React, { useState } from 'react';
import { BACKEND_URL } from '@/constants';
import { registerSchema } from '@/utils/validation';
import axiosInstance from '@/utils/fetchData';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { User, dbResponse } from '@/utils/type';
import { ZodError } from 'zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
const Register: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  console.log(username);
  console.log(email);
  console.log(password);
  const handleRegister = async () => {
    setLoading(true);
    try {
      const formData = registerSchema.parse({
        username: username.value,
        email: email.value,
        password: password.value,
      });
      axiosInstance
        .post('/users', formData)
        .then((response) => {
          setError('');
          router.push('/login');
        })
        .catch((error: AxiosError<dbResponse<User>>) => {
          const res: dbResponse<User> | undefined = error.response?.data;
          setError(res!.msg);
        });
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Access the error messages for each field
        const usernameError = error.issues.find((issue) => issue.path[0] === 'username');
        const emailError = error.issues.find((issue) => issue.path[0] === 'email');
        const passwordError = error.issues.find((issue) => issue.path[0] === 'password');
        // You can use the error messages as needed
        if (usernameError) {
          // Set the error messages in the state array
          setUsername({ ...username, error: usernameError.message })
        }
        if (emailError) {
          setEmail({ ...email, error: emailError.message })
        }
        if (passwordError) {
          setPassword({ ...password, error: passwordError.message })
        }
      };
    } finally {
      setLoading(false);
    }
  };
  const handleOnChange = (event: any) => {
    const { name, value } = event.target;
    switch (name) {
      case 'username': setUsername({ ...username, value: value }); break;
      case 'email': setEmail({ ...email, value: value }); break;
      case 'password': setPassword({ ...password, value: value }); break;
      default: console.log(name);
    }
  }
  return (
    <div className=' text-black flex items-center justify-center h-screen'>
      <div className='flex flex-col h-72 w-72 shadow-md rounded'>
        <h2 className="text-3xl font-semibold text-center text-indigo-600">Register</h2>
        <TextField
          required
          error={username.error !== ''}
          id={username.error !== '' ? "outlined-required" : "outlined-error-helper-text"}
          name="username"
          label="username"
          defaultValue=""
          onChange={handleOnChange}
          helperText={username.error !== '' && username.error}
          className='m-2'
        />
        <TextField
          required
          error={email.error !== ''}
          id={email.error !== '' ? "outlined-required" : "outlined-error-helper-text"}
          name="email"
          label="email"
          type="email"
          defaultValue=""
          helperText={email.error !== '' && email.error}
          onChange={handleOnChange}
          className='m-2'
        />
        <TextField
          required
          error={password.error !== ''}
          id={password.error !== '' ? "outlined-required" : "outlined-error-helper-text"}
          name="password"
          label="Password"
          type="password"
          defaultValue=""
          helperText={password.error !== '' && password.error}
          onChange={handleOnChange}
          className='m-2'
        />
        <div className='flex items-center justify-center'>
          <Button
            variant="contained"
            onClick={handleRegister}
            className='bg-cyan-700'
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress color='primary' /> : "Register"}
          </Button>
        </div>
        {error !== '' &&
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        }
      </div>
    </div>
  );
};

export default Register;
