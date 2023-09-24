// Login.tsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const handleLogin = async () => {

    try {
      const response = await fetch(`/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (response.ok) {
        console.log(response);
        console.log(response.url);
        router.push(response.url);
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'Login failed');
      }
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
    </div>
  );
};

export default Login;
