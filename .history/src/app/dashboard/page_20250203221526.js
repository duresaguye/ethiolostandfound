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
    <div>dashboard</div>
  )
}

 