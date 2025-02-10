"use client";
import React, { useState, useEffect, useCallback } from 'react';
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
}

const Profile = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const fetchItems = useCallback(async () => {
    if (session) {
      setLoading(true);
      try {
        const response = await fetch(`/api/profile/${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

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
      if (response.ok) {
        setItems((prevItems: Item[]) => prevItems.filter(item => item.id !== itemId));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (isPending || !session || loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Hey {session?.user?.name}, these are your posted items!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          If the rightful owner contacts you and retrieves an item, please remove it to keep your listings up-to-date.
        </p>

        {items.length === 0 ? (
          <p className="text-center text-gray-600">
            No items listed yet. Post something to help reconnect lost items with their owners!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                {item.image && (
                  <img
                    className="w-full h-48 object-cover rounded-t-xl"
                    src={item.image}
                    alt={item.itemName}
                  />
                )}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.itemName}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-1">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">📍 {item.location}</p>
                  <p className="text-sm text-gray-500 mb-1">📞 {item.contact}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    🗓 {new Date(item.date).toISOString().slice(0, 10)}
                  </p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    ❌ Delete
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
