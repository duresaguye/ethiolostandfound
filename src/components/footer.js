import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
      <footer className="bg-gray-900 text-white py-6">
           <div className="border-b-2 border-gray-300"></div>
          <div className="container mx-auto text-center">
              
        <p className="mb-2">© 2024 EthioLostFound. All rights reserved.</p>
        <p className="flex justify-center items-center">
          Made with ❤️ in Ethiopia | BY
          <a
            href="https://github.com/duresaguye"
            className="flex items-center ml-2 text-white underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="ml-1 mr-1" /> Dura
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
