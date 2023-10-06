import { redirect } from 'next/navigation'
import React from 'react'
import Dashboard from '@/components/Dashboard/dashboard';
import Outcome from './(logged)/outcomes/page';


export default function Home() {
    return (
        <>
          <Dashboard />
        </>
      );
}
