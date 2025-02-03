import React from 'react'

function dashboard() {
  const session = await auth.api.getSession();
  return (
    <div>dashboard</div>
  )
}

export default dashboard