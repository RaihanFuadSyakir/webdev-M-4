// Login.tsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/constants';
import { setCookie, getCookie } from 'cookies-next';
const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const testFetch = async () => {
    const token = getCookie("token");
    console.log(token)
    try {
      const response = await fetch(`${BACKEND_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=<${token}>`,
        },
        credentials: 'include',
      });
      const res = await response.json()
      console.log(res)
    } catch (error) {

    }

  }
  const handleLogin = async () => {

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });
      const res = await response.json();
      console.log(res)
      /* console.log(res);;
      setCookie("token", res.token); */
    } catch (error) {
      setError('An error occurred during login');
      console.log(error);
    }
  };

  return (
    <div >
      <h2>Login</h2>
      <div>
        <label>identifier:</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className='text-black'
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='text-black'
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={testFetch}>Fetch</button>
    </div>
  );
};

export default Login;
