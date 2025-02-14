"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { authClient } from "../../../lib/auth-client";
import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader';

interface Item {
  id: string;
  image?: string;
  itemName: string;
  description: string;
  location: string;
  contact: string;
  date: string;
  status: 'lost' | 'found';
}

const Profile = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const fetchItems = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/profile`, {
        next: { tags: ['user-items'] } // For future revalidation
      });
      
      if (!response.ok) throw new Error('Failed to fetch items');
      
      const { items } = await response.json();
      setItems(items);
      setError('');
    } catch (error) {
      setError('Failed to load your items. Please try again.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (itemId: string) => {
    try {
      const response = await fetch(`/api/profile/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Deletion failed');
      
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      setError('Failed to delete item. Please try again.');
      console.error('Delete error:', error);
    }
  };

  if (isPending || !session || loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Hey {session.user.name}, these are your posted items!
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          If the rightful owner contacts you and retrieves an item, please remove it to keep your listings up-to-date.
        </p>

        {error && (
          <p className="text-center text-red-500 dark:text-red-400 mb-6">{error}</p>
        )}

        {items.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No items listed yet. Post something to help reconnect lost items with their owners!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl dark:shadow-gray-700 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {item.image && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.itemName}
                      fill
                      className="object-cover rounded-t-xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {item.itemName}
                    </h3>
                    <span className={`inline-block px-2 py-1 text-sm rounded ${
                      item.status === 'lost' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-500 dark:text-gray-400 flex items-center">
                      <span className="mr-2">📍</span>
                      {item.location}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center">
                      <span className="mr-2">📞</span>
                      {item.contact}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center">
                      <span className="mr-2">🗓</span>
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="mt-4 w-full px-6 py-3 bg-red-500/90 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <span>❌</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;