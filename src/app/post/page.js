"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const PostItem = () => {
    const [item, setItem] = useState({
        title: '',
        description: '',
        location: '',
        contact: '',
        date: '',
        image: null,
        item_type: 'found',
    });

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setItem({ ...item, image: file });
    };

    const validateForm = () => {
        // Check if any required field is empty
        return item.title && item.description && item.location && item.contact && item.date;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill in all required fields.');
            return;
        }

        // Log the data to simulate form submission
        console.log('Item submitted:', item);

        // Reset form fields after submission
        setItem({
            title: '',
            description: '',
            location: '',
            contact: '',
            date: '',
            image: null,
            item_type: 'found',
        });

        alert('Item submitted successfully');
        router.push('/profile'); // Navigate to the profile page after posting
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="container mx-auto p-4 max-w-xl">
                <h1 className="text-4xl font-bold mb-6 text-center">Post a Lost or Found Item</h1>
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Item Name</label>
                        <input
                            type="text"
                            name="title"
                            value={item.title}
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
                            name="item_type"
                            value={item.item_type}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200"
                        >
                            <option value="found">Found</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
                    >
                        Post Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostItem;