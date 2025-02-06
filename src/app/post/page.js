"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../../../lib/auth-client';
import Loader from '../../components/Loader';

const PostItem = () => {
  const [item, setItem] = useState({
    itemName: '',
    description: '',
    location: '',
    contact: '',
    date: '',
    image: null,
    status: 'found',
  });
 
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // This useEffect hook handles redirection
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setItem({ ...item, image: file });
  };

  const validateForm = () => {
    return item.itemName && item.description && item.location && item.contact && item.date;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('itemName', item.itemName);
      formData.append('description', item.description);
      formData.append('location', item.location);
      formData.append('contact', item.contact);
      formData.append('date', item.date);
      formData.append('status', item.status);
      formData.append('userId', session.user.id);
      if (item.image) {
        formData.append('image', item.image);
      }

      const response = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Item submitted successfully');
        setItem({
          itemName: '',
          description: '',
          location: '',
          contact: '',
          date: '',
          image: null,
          status: 'found',
        });
        router.push('/profile');
      } else {
        alert('Failed to submit item');
      }
    } catch (error) {
      console.error('Failed to submit item:', error);
      alert('Failed to submit item');
    }
  };

  if (isPending || !session) {
    return <div><Loader /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Post a Lost or Found Item</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* Item Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={item.itemName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              name="description"
              value={item.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Location</label>
            <input
              type="text"
              name="location"
              value={item.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={item.contact}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Date</label>
            <input
              type="date"
              name="date"
              value={item.date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Status</label>
            <select
              name="status"
              value={item.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
            >
              <option value="found">Found</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 rounded-md text-white font-semibold hover:bg-indigo-700"
            >
              Submit Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItem;