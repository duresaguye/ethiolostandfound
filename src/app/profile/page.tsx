"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { authClient } from "../../../lib/auth-client";
import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader';

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

  interface Item {
    id: string;
    image?: string;
    itemName: string;
    description: string;
    location: string;
    contact: string;
    date: string;
  }

  const handleDelete = async (itemId: string) => {
    try {
      const formData = new FormData();
      formData.append("id", itemId);
      const response = await fetch(`/api/profile/${session?.user.id}`, {
        method: 'DELETE',
        body: formData,
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
    return <div><Loader /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Posted Items</h2>
        {items.length === 0 ? (
          <p className="text-center">No items to display</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {item.image && (
                  <img
                    className="w-full h-32 object-cover"
                    src={item.image}
                    alt={item.itemName}
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.itemName}</h3>
                  <p className="text-sm">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Location: {item.location}</p>
                  <p className="text-xs text-gray-400 mt-1">Contact: {item.contact}</p>
                  <p className="text-xs text-gray-400">
                    Date: {new Date(item.date).toISOString().slice(0, 10)}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-xs px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
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
