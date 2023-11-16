import { redirect } from 'next/navigation'
import React from 'react'
import Dashboard from '@/components/Dashboard/dashboard';
import Outcome from './outcomes/page';


export default function Home() {
  redirect('/finance-management/dashboard');
}
