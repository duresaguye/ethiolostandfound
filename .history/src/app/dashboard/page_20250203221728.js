import React from 'react'
import { auth } from '../../../lib/auth-client'
import { headers } from 'next/headers';

export default async function dashboard() {
  const session = await auth.api.getSession({
    headers: {
     headers: await headers()
    }
  });
  if(!session) {
    window.location.href = '/login';
    return;
  }
  return (
  <div className='mt-10 text-center'>
     <h1 className='text-2xl font-bold underline'>dashboard</h1>
     <ui>
        <li>Dashboard</li>
        <li>Profile</li>
        <li>Settings</li>
        <li>Logout</li>
     </ui>




  </div>
 
    
  )
}

 