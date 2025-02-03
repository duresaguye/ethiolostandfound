import React from 'react';

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">
        <a href="/">Logo</a>
      </div>
      <div className="space-x-4">
        <a href="/login" className="hover:underline">Login</a>
        <a href="/signup" className="hover:underline">Signup</a>
      </div>
    </nav>
  );
}

export default Navbar;