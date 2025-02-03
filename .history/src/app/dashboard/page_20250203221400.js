import React from 'react'
import { auth } from '../../../lib/auth-client'

export default async function dashboard() {
  const session = await auth.api.getSession();
  return (
    <div>dashboard</div>
  )
}

