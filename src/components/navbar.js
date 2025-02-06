"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();



  const handleSignOut = async () => {
    await authClient.signOut();
  
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  

  return (
    <>
      <nav className="flex flex-col lg:flex-row justify-between items-center py-4 sticky top-0 z-50 bg-gray-900 text-gray-100 shadow-md">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Link href="/" className="text-xl lg:text-2xl font-bold flex items-center space-x-1">
            <span className="text-green-500">E</span>
            <span className="text-yellow-500">t</span>
            <span className="text-red-500">h</span>
            <span className="text-blue-500">i</span>
            <span className="text-green-500">o</span>
            <span className="text-yellow-500 ml-1">L</span>
            <span className="text-red-500">o</span>
            <span className="text-blue-500">s</span>
            <span className="text-green-500">t</span>
            <img
              src="/Emblem_of_Ethiopia.svg.png"
              alt="Emblem of Ethiopia"
              className="w-6 h-6"
            />
            <span className="text-red-500 ml-1">F</span>
            <span className="text-blue-500">o</span>
            <span className="text-green-500">u</span>
            <span className="text-yellow-500">n</span>
            <span className="text-red-500">d</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex flex-grow justify-between items-center text-center text-lg ml-96">
          <div className="flex space-x-32">
            <Link href="/" className="inline-block hover:underline">Home</Link>
            {!session ? (
              <>
                <Link href="/signup" className="inline-block hover:underline">Sign Up</Link>
                <Link href="/login" className="inline-block hover:underline">Login</Link>
              </>
            ) : (
              <>
                <Link href="/post" className="inline-block hover:underline">Post Item</Link>
                <Link href="/profile" className="inline-block hover:underline">Profile</Link>
                <button onClick={handleSignOut} className="inline-block hover:underline">Logout</button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden flex items-center relative z-50" 
         
          aria-label="Toggle mobile menu"
        >
          <div className={`w-6 h-6 flex flex-col justify-center items-center relative transition-transform duration-300 ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-white mt-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-white mt-1 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-40 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <Link href="/" className="text-white text-xl font-semibold">Home</Link>
          {!session ? (
            <>
              <Link href="/signup" className="text-white text-xl font-semibold" >Sign Up</Link>
              <Link href="/login" className="text-white text-xl font-semibold">Login</Link>
            </>
          ) : (
            <>
              <Link href="/post" className="text-white text-xl font-semibold">Post Item</Link>
              <Link href="/profile" className="text-white text-xl font-semibold">Profile</Link>
              <button onClick={handleSignOut} className="text-white text-xl font-semibold">Logout</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;