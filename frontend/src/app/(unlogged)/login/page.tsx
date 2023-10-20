// Login.tsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/fetchData';
import { User, dbResponse } from '@/utils/type'
import { loginSchema } from '@/utils/validation';
import { ZodError } from 'zod';
import { Avatar, Box, Button, Checkbox, CircularProgress, CssBaseline, FormControlLabel, Grid, Link, Paper, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AxiosError, AxiosResponse } from 'axios';
import Image from "next/image"

const defaultTheme = createTheme()

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(['', '', '']);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const handleOnChange = (event: any) => {
    const { name, value } = event.target;
    if (name === 'identifier') {
      setIdentifier(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
  }
  const handleLogin = () => {
    try {
      setLoading(true);
      const formData = loginSchema.parse({ identifier, password });
      axiosInstance
        .post('/users/login', formData)
        .then((response) => {
          const removeError = ['', '', '']
          setErrors(removeError);
          router.push('/dashboard');
        })
        .catch((error: AxiosError<dbResponse<User>>) => {
          const updateError = [...errors]
          const res: dbResponse<User> | undefined = error.response?.data;
          updateError[2] = res!.msg;
          setErrors(updateError);
          setLoading(false);
        });
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Access the error messages for each field
        const errorMessages = ['', '']
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
    <>
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/003/177/460/non_2x/digital-marketing-budget-financial-campaign-for-advertising-team-free-vector.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 15,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="h-20 w-25 relative my-5"> 
              <Image
                src="/logo-noname.png"
                alt="Logo"
                layout="fill" 
                className="" 
              />
            </div>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username / Email"
                error={errors[0] !== ''}
                id={errors[0] !== '' ? "outlined-required" : "outlined-error-helper-text"}
                name="identifier"
                value={identifier}
                InputLabelProps={{ shrink: identifier !== '' }}
                onChange={handleOnChange}
                helperText={errors[0] !== '' && errors[0]}
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                required
                error={errors[1] !== ''}
                id={errors[1] !== '' ? "outlined-required" : "outlined-error-helper-text"}
                name="password"
                label="Password"
                type="password"
                value={password}
                InputLabelProps={{ shrink: password !== '' }}
                helperText={errors[1] !== '' && errors[1]}
                onChange={handleOnChange}
              />
              {isLoading ? <CircularProgress color='primary' /> : <Button
                variant="contained"
                type="submit"
                fullWidth
                className={`${!isLoading &&  'bg-sky-400'}`}
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                Log in
              </Button>}
              {errors[2] !== '' &&
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline">{errors[2]}</span>
                </div>
              }
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    {/* <div className=' text-black flex items-center justify-center h-screen'>
      <div className='flex flex-col h-72 w-72 shadow-md rounded'>
        <h2 className="text-3xl font-semibold text-center text-indigo-600">Login</h2>
        <TextField
          required
          error={errors[0] !== ''}
          id={errors[0] !== '' ? "outlined-required" : "outlined-error-helper-text"}
          name="identifier"
          label="username/email"
          value={identifier}
          InputLabelProps={{ shrink: identifier !== '' }}  
          onChange={handleOnChange}
          helperText={errors[0] !== '' && errors[0]}
          className='m-2'
        />
        <TextField
          required
          error={errors[1] !== ''}
          id={errors[1] !== '' ? "outlined-required" : "outlined-error-helper-text"}
          name="password"
          label="Password"
          type="password"
          value={password}
          InputLabelProps={{ shrink: password !== '' }}
          helperText={errors[1] !== '' && errors[1]}
          onChange={handleOnChange}
          className='m-2'
        />
        <div className='flex items-center justify-center'>
        {isLoading ? <CircularProgress color='primary' /> : <Button
            variant="contained"
            onClick={handleLogin}
            className={`${!isLoading &&  'bg-cyan-700'}`}
            disabled={isLoading}
          >
            <div>Login</div>
          </Button>}
        </div>
        {errors[2] !== '' &&
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{errors[2]}</span>
          </div>
        }
      </div>
    </div> */}
    </>
  );
};

export default Login;
