import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
  <FaSpinner className="text-4xl animate-spin text-gray-500" />
</div>
  );
  
  export default Loader;
  