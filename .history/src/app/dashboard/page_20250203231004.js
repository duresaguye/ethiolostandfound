import React from 'react'
import { auth } from "../../../lib/auth"; 
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';


export default async function dashboard() {
  const session = await auth.api.getSession({
    
     headers: await headers()
  
  });
  if(!session) {
    redirect = '/login';
   
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

 