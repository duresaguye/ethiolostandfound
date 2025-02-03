import React from 'react';
import { auth } from "../../lib/auth";
import link from 'next/link';


import { headers } from 'next/headers';
import Link from 'next/link';

export default async function Navbar() {
    const session = await auth.api.getSession({
    
        headers: await headers()
     
     });
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">
        <a href="/">Logo</a>
      </div>
      <div className="space-x-4">
        <div>
        <link href="/login" className="hover:underline">Login</link>
        </div>
     
      </div>
    </nav>
  );
}

