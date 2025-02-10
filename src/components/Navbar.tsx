"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import EthiopiaFlag from "./EthiopiaFlag";
import { useRouter } from "next/navigation";
import Loader from '../components/Loader';
import ThemeToggle from '../components/theme-toggle';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <nav className="flex flex-col lg:flex-row items-center py-4 sticky top-0 z-50 bg-white dark:bg-gray-900  transition-colors duration-300">
        {/* Logo & Theme Toggle */}
        <div className="flex items-center justify-between w-full px-4 lg:px-8">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <EthiopiaFlag />
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle for Mobile */}
            <div className="lg:hidden">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <div className={`w-6 h-6 flex flex-col justify-center items-center transition-transform duration-300 ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className={`w-6 h-0.5 bg-gray-900 dark:bg-gray-200 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-900 dark:bg-gray-200 mt-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-900 dark:bg-gray-200 mt-1 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-grow justify-between items-center px-8 w-full">
          <div className="flex gap-10 text-lg">
            <Link href="/" className="hover:underline py-2">Home</Link>
            <Link href="/lost" className="hover:underline py-2">Lost Item</Link>
            <Link href="/found" className="hover:underline py-2">Found Item</Link>
            {session && (
              <>
                <Link href="/post" className="hover:underline py-2">Post Item</Link>
                <Link href="/profile" className="hover:underline py-2">Profile</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            {!session ? (
              <Link href="/signup" className="hover:underline py-2">Sign Up</Link>
            ) : (
              <button onClick={handleSignOut} className="hover:underline py-2">Logout</button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 z-40 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <Link href="/" className="text-gray-900 dark:text-white text-xl font-semibold hover:text-gray-500" onClick={handleLinkClick}>
            Home
          </Link>
          <Link href="/lost" className="text-gray-900 dark:text-white text-xl font-semibold hover:text-gray-500" onClick={handleLinkClick}>
            Lost Item
          </Link>
          <Link href="/found" className="text-gray-900 dark:text-white text-xl font-semibold hover:text-gray-500" onClick={handleLinkClick}>
            Found Item
          </Link>
          {!session ? (
            <>
              <Link href="/signup" className="text-gray-900 dark:text-white text-xl font-semibold hover:text-gray-500" onClick={handleLinkClick}>
                Sign Up
              </Link>
              <Link href="/login" className="text-gray-900 dark:text-white text-xl font-semibold hover:text-gray-500" onClick={handleLinkClick}>
                Login
              </Link>
            </>
          ) : (
            <>
              <Link href="/post" className="text-gray-900 dark:text-white text-xl font-semibold hover:text-gray-500" onClick={handleLinkClick}>
                Post Item
              </Link>
              <Link href="/profile" className="text-gray-900 dark:text-white text-xl font-semibold hover:text-gray-500" onClick={handleLinkClick}>
                Profile
              </Link>
              <button onClick={handleSignOut} className="text-gray-900 dark:text-white text-xl font-semibold hover:text-gray-500">
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