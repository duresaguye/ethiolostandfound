"use client";
import React, { useState, useEffect } from 'react';
import { authClient } from "../../../lib/auth-client";
import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader';

const Profile = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/profile/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setItems(data.items);
            setProfilePhoto(data.user.photo || null);
          } else {
            console.error('Failed to fetch profile data');
          }
        } catch (error) {
          console.error('Failed to fetch profile data:', error);
        }
      }
    };

    fetchProfileData();
  }, [session]);

  const handleDelete = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  if (isPending || !session) {
    return <div><Loader /></div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Posted Items</h2>
            {items.length === 0 ? (
              <p>No items to display</p>
            ) : (
              <ul className="space-y-2 lg:flex flex-row">
                {items.map(item => (
                  <li key={item.id} className="p-4 rounded-lg shadow-md">
                    {item.image && (
                      <img className="rounded-t-lg w-40 h-40 object-cover" src={item.image} alt={item.title} />
                    )}
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p>{item.description}</p>
                    <p className="text-sm text-gray-400">Location: {item.location}</p>
                    <p className="mb-2"><strong>Date:</strong> {new Date(item.date_posted).toLocaleDateString()}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 px-3 py-1 rounded-md text-white font-semibold hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'about':
        return (
          <div className="mt-2">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p>{user?.bio || 'No bio available'}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
      <main className="flex-1 ml-20 lg:ml-20 p-4 lg:mt-0">
        <div className="rounded-lg shadow-lg">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Profile;