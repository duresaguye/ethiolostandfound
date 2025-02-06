"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import Loader from '../../../components/Loader';


const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        console.log(`Fetching: /api/items/${id}`); // Debugging
        const response = await fetch(`/api/items/${id}`);
    
        if (!response.ok) {
          const errorText = await response.text(); // Read error message
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
    
        const data = await response.json();
        console.log("Fetched item:", data);
        setItem(data.item);
      } catch (error) {
        console.error("Fetch error:", error.message);
        setError(`Failed to fetch item: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div >
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!item) {
    return <p className="text-center text-gray-500">Item not found</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.itemName} 
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <h1 className="text-3xl font-bold mt-4 text-green-600">{item.itemName}</h1>
        <p className="mt-2 text-xl text-gray-700">{item.description}</p>
        <p className="mt-4 text-lg text-gray-500"><strong>Location:</strong> {item.location}</p>
        <p className="mt-4 text-lg text-gray-500"><strong>Date Found:</strong> {item.date}</p>
        <p className="mt-4 text-lg text-gray-500"><strong>Details:</strong> {item.description}</p>
      </div>
    </div>
  );
};

export default ItemDetails;