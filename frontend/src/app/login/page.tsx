// Login.tsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/constants';
import { setCookie, getCookie } from 'cookies-next';
import axios, { AxiosResponse } from 'axios';
import { User, dbResponse } from '@/type/type'
const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const testFetch = () => {
    const token = getCookie("token");
    console.log(token)
    axios.get(`${BACKEND_URL}/api/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer your-token-here',
      },
      withCredentials: true,
    }).then((response: AxiosResponse) => {
      const res: dbResponse<User> = response.data;
      const users: User[] = res.data;
      setUsers(users);
    }).catch((e) => { console.log(e) })

  }
  const handleLogin = async () => {
    axios.post(`${BACKEND_URL}/api/users/login`, {
      identifier: identifier,
      password: password
    }, {
      withCredentials: true // Include cookies in the request
    })
      .then((response: AxiosResponse) => {
        console.log(response.data)
      })
  };

  return (
    <div className=' text-black'>
      <h2>Login</h2>
      <div>
        <label>identifier:</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className=''
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
      {users && (users.map((user) => (
        <div key={user.id}>{user.username}</div>
      )))}
    </div>
  );
};

export default Login;
