"use client";
import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const fetchItems = () => {
    const mockItems = [
      { id: 1, title: 'Item 1', description: 'Description 1', location: 'Location 1', date_posted: '2023-01-01', image: '' },
      { id: 2, title: 'Item 2', description: 'Description 2', location: 'Location 2', date_posted: '2023-02-01', image: '' }
    ];
    setItems(mockItems);
  };

  const fetchUser = () => {
    const mockUser = { name: 'John Doe', bio: 'This is a sample bio', photo: '' };
    setUser(mockUser);
    setProfilePhoto(mockUser.photo || null);
  };

  useEffect(() => {
    fetchItems();
    fetchUser();
  }, []);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      // Simulate a photo upload (no actual backend call here)
      setProfilePhoto(URL.createObjectURL(file)); // Preview the uploaded photo
    }
  };

  const handleDelete = (itemId) => {
    // Simulate deletion of an item (no actual backend call here)
    setItems(items.filter(item => item.id !== itemId));
  };

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
      <aside className="w-20 lg:w-60 h-full bg-gray-800 lg:p-4 flex flex-col sticky top-0 left-0">
        <div className="flex flex-col items-center lg:mt-0">
          <input
            type="file"
            onChange={handleProfilePhotoChange}
            className="hidden"
            id="profile-photo-upload"
          />
          <label htmlFor="profile-photo-upload" className="cursor-pointer">
            <div className="w-20 h-20 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-600">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-400">
                  {/* Placeholder for profile image */}
                </div>
              )}
            </div>
          </label>
          <h1 className="text-base lg:text-xl font-bold text-center mt-4">{user ? user.name : 'Loading...'}</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-2 lg:px-4 py-2 text-sm lg:text-lg font-semibold ${activeTab === 'posts' ? 'bg-gray-700' : 'text-gray-400'} rounded-md`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-2 lg:px-4 py-2 text-sm lg:text-lg font-semibold ${activeTab === 'about' ? 'bg-gray-700' : 'text-gray-400'} rounded-md`}
          >
            About
          </button>
        </nav>
      </aside>

      <main className="flex-1 ml-20 lg:ml-20 p-4 lg:mt-0">
        <div className="rounded-lg shadow-lg">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Profile;