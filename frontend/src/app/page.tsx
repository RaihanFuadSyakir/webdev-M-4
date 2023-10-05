import { redirect } from 'next/navigation'
import React from 'react'
import Dashboard from './dashboard/page';
import Outcome from './outcomes/page';

export default function Home() {
    redirect('/dashboard');
}
