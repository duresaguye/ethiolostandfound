"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../../../lib/auth-client';
import Loader from '../../components/Loader';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large (max 5MB)');
      return;
    }
    setItem((prev) => ({ ...prev, image: file }));
  };

  const validateForm = () => {
    return item.itemName && item.description && item.location && item.contact && item.date;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(item).forEach(([key, value]) => {
        if (key === 'image' && value) formData.append(key, value);
        else formData.append(key, String(value));
      });

      const response = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Item submitted successfully');
        router.push('/profile');
      } else {
        const result = await response.json();
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
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto max-w-xl w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Post a Lost or Found Item
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Item Name", name: "itemName", type: "text" },
            { label: "Location", name: "location", type: "text" },
            { label: "Contact Number", name: "contact", type: "tel" },
            { label: "Date", name: "date", type: "date" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={item[name as keyof Item] as string}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 transition-all"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={item.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 transition-all"
              rows={4}
              placeholder="Describe the item in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full cursor-pointer">
                <div className="px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.image ? item.image.name : 'Click to upload image (max 5MB)'}
                    </p>
                  </div>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={item.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
            >
              <option value="found">Found Item</option>
              <option value="lost">Lost Item</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                isSubmitting 
                  ? 'bg-indigo-400 dark:bg-indigo-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItem;