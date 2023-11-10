"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/constants';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import WalletList from '@/components/wallet/WalletList';
import NewWalletForm from '@/components/wallet/NewWalletForm';
import Breadcrumb from '@/components/template/Breadcrumbs/Breadcrumb';

const WalletPage = () => {


  return (
    <>
    <Breadcrumb pageName="Wallet" />
    <div className="rounded flex flex-col">
      {/* <NewWalletForm/> */}
      <WalletList/>
    </div>
    </>
  );
};

export default WalletPage;
