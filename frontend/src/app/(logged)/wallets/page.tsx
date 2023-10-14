"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/constants';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import WalletList from '@/components/wallet/WalletList';
import NewWalletForm from '@/components/wallet/NewWalletForm';

const WalletPage = () => {


  return (
    <div className="h-96 w-9 rounded flex flex-col">
      {/* <NewWalletForm/> */}
      <WalletList/>
    </div>
  );
};

export default WalletPage;
