"use client";
import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import EthiopiaFlag from "./EthiopiaFlag";
import { useRouter } from "next/navigation";
import Loader from '../components/Loader';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  if (isPending) {
    return <Loader />; 
  }

  return (
    <>
      <nav className="flex flex-col lg:flex-row items-center py-4 sticky top-0 z-50 bg-gray-300  shadow-2xl">
        {/* Logo */}
        <div className="flex items-center space-x-2 lg:space-x-4 lg:ml-4">
          <EthiopiaFlag />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-grow justify-center items-center text-lg">
          <div className="flex space-x-28">
            <Link href="/" className="inline-block hover:underline">Home</Link>
            <Link href="lost" className="inline-block hover:underline">Lost Item</Link>
            <Link href="found" className="inline-block hover:underline">Found Item</Link>
            {!session ? (
              <>
                <Link href="/signup" className="inline-block hover:underline">Sign Up</Link>
               
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

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex items-center relative z-50 p-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <div className={`w-6 h-6 flex flex-col justify-center items-center relative transition-transform duration-300 ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className={`w-6 h-0.5 bg-gray-900 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-900 mt-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-800 mt-1 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-gray-300 bg-opacity-75 z-40 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <Link href="/" className="text-gray-900 text-xl font-semibold hover:text-gray-500 transition-colors" onClick={handleLinkClick}>
            Home
          </Link>
          <Link href="lost" className="text-gray-900 text-xl font-semibold hover:text-gray-500 transition-colors" onClick={handleLinkClick}>
            Lost Item
          </Link>
          <Link href="found" className="text-gray-900 text-xl font-semibold hover:text-gray-500 transition-colors" onClick={handleLinkClick}>
            Found Item
          </Link>
          {!session ? (
            <>
              <Link href="/signup" className="text-gray-900 text-xl font-semibold hover:text-gray-500 transition-colors" onClick={handleLinkClick}>
                Sign Up
              </Link>
              <Link href="/login" className="text-gray-900 text-xl font-semibold hover:text-gray-500 transition-colors" onClick={handleLinkClick}>
                Login
              </Link>
            </>
          ) : (
            <>
              <Link href="/post" className="text-gray-900 text-xl font-semibold hover:text-gray-500 transition-colors" onClick={handleLinkClick}>
                Post Item
              </Link>
              <Link href="/profile" className="text-gray-900 text-xl font-semibold hover:text-gray-500 transition-colors" onClick={handleLinkClick}>
                Profile
              </Link>
              <button onClick={handleSignOut} className="text-gray-900 text-xl font-semibold hover:text-gray-500 transition-colors">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;