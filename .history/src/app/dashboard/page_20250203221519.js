import React from 'react'
import { auth } from '../../../lib/auth-client'
import { headers } from 'next/headers';

export default async function dashboard() {
  const session = await auth.api.getSession({
    headers: {
     headers: await headers()
    }
  });
  if()
  return (
    <div>dashboard</div>
  )
}

 