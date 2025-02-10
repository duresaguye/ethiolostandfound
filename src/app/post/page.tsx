"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../../../lib/auth-client';
import Loader from '../../components/Loader';

// Define the Item interface at the top
interface Item {
  itemName: string;
  description: string;
  location: string;
  contact: string;
  date: string;
  image: File | null;
  status: 'found' | 'lost';
}

const PostItem = () => {
  const [item, setItem] = useState<Item>({
    itemName: '',
    description: '',
    location: '',
    contact: '',
    date: '',
    image: null,
    status: 'found',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  // Handle text, textarea, and select changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }
    const file = files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size too large (max 5MB)');
      return;
    }
    setItem((prev) => ({ ...prev, image: file }));
  };

  // Simple form validation
  const validateForm = () => {
    return item.itemName && item.description && item.location && item.contact && item.date;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('itemName', item.itemName);
      formData.append('description', item.description);
      formData.append('location', item.location);
      formData.append('contact', item.contact);
      formData.append('date', item.date);
      formData.append('status', item.status);
      
      if (item.image) {
        formData.append('image', item.image);
      }

      const response = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Item submitted successfully');
        // Reset the form
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
        alert(result.error || 'Failed to submit item');
      }
    } catch (error) {
      console.error('Failed to submit item:', error);
      alert('Failed to submit item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending || !session) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 flex items-center justify-center">
      <div className="mx-auto max-w-xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Post a Lost or Found Item
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
          {/* Item Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={item.itemName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 text-gray-900"
            />
          </div>
          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={item.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 text-gray-900"
            />
          </div>
          {/* Location Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={item.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 text-gray-900"
            />
          </div>
          {/* Contact Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={item.contact}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 text-gray-900"
            />
          </div>
          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={item.date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 text-gray-900"
            />
          </div>
          {/* Image Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-1 block w-full text-gray-900"
            />
          </div>
          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={item.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 text-gray-900"
            >
              <option value="found">Found</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-indigo-600 rounded-md text-white font-semibold ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
