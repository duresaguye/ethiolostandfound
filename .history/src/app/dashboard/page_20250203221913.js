import React from 'react'
import { authClient } from "../../../lib/auth-client"; 
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
  const user = session.user;
  const email = user.email;
  return (
  <div className='mt-10 text-center'>
     <h1 className='text-2xl font-bold underline'>dashboard</h1>
     <ui>
        <li>Name:{user.name}</li>
        <li>email{user.email}</li>
        
     </ui>




  </div>
 
    
  )
}

 