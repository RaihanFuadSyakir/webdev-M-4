"use client"
// Registration.tsx
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { BACKEND_URL } from '@/constants';
const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleRegister = async () => {
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const response = await fetch(`http://${BACKEND_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password: hashedPassword }),
      });

      if (response.ok) {
        // Registration successful, redirect or perform desired action
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='text-black'
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
