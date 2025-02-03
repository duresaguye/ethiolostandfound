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
     <div>dashboard</div>
     <ui>
        <li>Dashboard</li>
        <li>Profile</li>
        <li>Settings</li>
        <li>Logout</li>
     </ui>




  </div>
 
    
  )
}

 