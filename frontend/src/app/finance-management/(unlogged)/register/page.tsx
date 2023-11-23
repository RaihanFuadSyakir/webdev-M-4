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
import { Box, CssBaseline, Grid, Paper, Typography, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Image from "next/image"

const defaultTheme = createTheme()

const Register: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
          router.push('/finance-management/login');
        })
        .catch((error: AxiosError<dbResponse<User>>) => {
          const res: dbResponse<User> = error.response?.data!;
          setError(res.msg);
          setLoading(false);
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
              my: 5,
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
            <Typography className='font-bold mb-3' component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 1, width:'100%' }}>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
              <TextField
                required
                margin='normal'
                fullWidth
                error={username.error !== ''}
                id={username.error !== '' ? "outlined-required" : "outlined-error-helper-text"}
                name="username"
                value={username.value}
                InputLabelProps={{ shrink: username.value !== '' }}
                onChange={handleOnChange}
                helperText={username.error !== '' && username.error}
              />
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <TextField
                required
                margin='normal'
                fullWidth
                error={email.error !== ''}
                id={email.error !== '' ? "outlined-required" : "outlined-error-helper-text"}
                name="email"
                type="email"
                value={email.value}
                InputLabelProps={{ shrink: email.value !== '' }}
                helperText={email.error !== '' && email.error}
                onChange={handleOnChange}
              />
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <TextField
                required
                margin='normal'
                fullWidth
                error={password.error !== ''}
                id={password.error !== '' ? "outlined-required" : "outlined-error-helper-text"}
                name="password"
                type="password"
                value={password.value}
                InputLabelProps={{ shrink: password.value !== '' }}
                helperText={password.error !== '' && password.error}
                onChange={handleOnChange}
              />
              <p className="mt-5 text-center text-sm text-gray-500">
                Already have an account? 
                <a href="/finance-management/login" className="font-semibold leading-6 text-sky-400 hover:text-blue-700"> Log in here</a>
              </p>
              <div className='text-center items-center justify-center'>
              {isLoading ? <CircularProgress color='primary' /> : <Button
                  variant="contained"
                  type='submit'
                  fullWidth
                  onClick={handleRegister}
                  className={`${!isLoading &&  'bg-sky-400'}`}
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  <div>Register</div>
                </Button>}
              {error !== '' &&
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              }
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Register;
