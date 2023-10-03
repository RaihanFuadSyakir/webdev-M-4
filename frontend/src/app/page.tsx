import { redirect } from 'next/navigation'
import React from 'react'
import Dashboard from './dashboard/page';
import Outcome from './outcome/page';

export default function Home() {
    return (
        <div>
            <Outcome />
        </div>
    )
}
