import React from "react";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="border-b-2 border-gray-300 dark:border-gray-600 mb-6"></div>
      <div className="container mx-auto px-4">
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <Link 
            href="/lost" 
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            Lost Items
          </Link>
          <Link 
            href="/found" 
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            Found Items
          </Link>
          <Link 
            href="/post" 
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            Post Item
          </Link>
        </div>

        {/* Copyright and Credits */}
        <div className="text-center">
        <p className="mb-2 text-gray-600 dark:text-gray-400">
  © {new Date().getFullYear()} EthioLostFound. All rights reserved.
</p>
          <p className="flex justify-center items-center text-gray-600 dark:text-gray-400">
            Made with  BY
            <a
              href="https://www.duresa.me/"
              className="flex items-center ml-2 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Duresa Guye
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;