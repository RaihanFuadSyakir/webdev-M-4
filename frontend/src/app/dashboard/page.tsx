import React from 'react'
import { cookies } from 'next/headers'
export default async function Dashboard() {
  const username = cookies().get("username");
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Hello {username?.value}</h2>
    </div>
  )
}
