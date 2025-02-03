import React from 'react'
import { auth } from '../../../lib/auth-client'

function dashboard() {
  const session = await auth.api.getSession();
  return (
    <div>dashboard</div>
  )
}

export default dashboard