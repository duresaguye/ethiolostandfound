"use client";
import React from 'react';
import { useParams } from 'next/navigation';

const ItemDetails = () => {
  const { id } = useParams();

  // Simulated item details - replace with actual data fetching logic
  const items = [
    {
      id: '1',
      title: 'Lost Phone',
      description: 'A black iPhone found near the campus.',
      item_type: 'lost',
      location: 'Campus A',
      date: '2025-02-04',
      image: '/images/lost-phone.jpg',
    },
    {
      id: '2',
      title: 'Found Wallet',
      description: 'A brown wallet found near the library.',
      item_type: 'found',
      location: 'Campus B',
      date: '2025-02-03',
      image: '/images/found-wallet.jpg',
    },
  ];

  const item = items.find(item => item.id === id);

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <h1 className="text-3xl font-bold mt-4 text-green-600">{item.title}</h1>
        <p className="mt-2 text-xl text-gray-700">{item.description}</p>
        <p className="mt-4 text-lg text-gray-500"><strong>Location:</strong> {item.location}</p>
        <p className="mt-4 text-lg text-gray-500"><strong>Date Found:</strong> {item.date}</p>
        <p className="mt-4 text-lg text-gray-500"><strong>Details:</strong> {item.description}</p>
      </div>
    </div>
  );
};

export default ItemDetails;
