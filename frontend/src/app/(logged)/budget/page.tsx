"use client";

import React, { useState, useEffect } from 'react';
import BudgetList from '@/components/Budget/BudgetList';
import Breadcrumb from '@/components/template/Breadcrumbs/Breadcrumb';

const WalletPage = () => {


  return (
    <>
    <Breadcrumb pageName="Budget" />
    <div className="rounded flex flex-col">
      {/* <NewWalletForm/> */}
      <BudgetList/>
    </div>
    </>
  );
};

export default WalletPage;
