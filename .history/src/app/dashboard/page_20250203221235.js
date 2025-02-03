import React from 'react'

function dashboard() {
  const session = await authClient.getSession();
  return (
    <div>dashboard</div>
  )
}

export default dashboard