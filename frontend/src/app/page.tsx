import { redirect } from 'next/navigation'
import React from 'react'
import Dashboard from '@/components/Dashboard/dashboard';

export default function Home() {
    return (
        <>
          <Dashboard />
        </>
      );
}
