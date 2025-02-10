"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Loader from "../components/Loader";
import { debounce } from 'lodash';

interface Item {
  id: string;
  itemName: string;
  description: string;
  status: 'lost' | 'found' | 'all';
  image?: string;
  location: string;
  date: string;
}

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Fetch items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/items');
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
        } else {
          setError('Failed to fetch items');
        }
      } catch (error) {
        setError('Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Debounced search handler
  const handleSearchChange = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Filter items based on the filter selection, search query, and location query
  const filteredItems = items
    .filter((item) =>
      (filter === 'all' || item.status === filter) &&
      (item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      item.location.toLowerCase().includes(locationQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  if (loading || isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-green-600">Welcome to </span>
            <span className="text-yellow-600">Ethiolost</span>
            <img
              src="/Emblem_of_Ethiopia.svg.png"
              alt="Emblem of Ethiopia"
              className="w-10 h-10 inline-block align-middle ml-2"
            />
            <span className="text-red-600"> Found!</span>
          </h1>
          <p className="text-xl mb-6 text-gray-700">
            Discover a world of lost and found treasures! Whether you are searching for a lost item or want to help reunite others with their belongings, you are in the right place.
          </p>
        </header>

        {/* Search Input */}
        <div className="mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search items..."
            onChange={handleSearchChange}
            className="w-full px-6 py-4 border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 mx-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('lost')}
            className={`px-4 py-2 mx-2 rounded-lg ${filter === 'lost' ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}
          >
            Lost
          </button>
          <button
            onClick={() => setFilter('found')}
            className={`px-4 py-2 mx-2 rounded-lg ${filter === 'found' ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}
          >
            Found
          </button>
        </div>

        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Lost and Found Items
        </h2>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col min-h-[300px] cursor-pointer"
              >
                <Link
                  href={`/item/${item.id}`}
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      router.push(`/login?redirect=${encodeURIComponent(`/item/${item.id}`)}`);
                    }
                  }}
                  className="flex flex-col flex-1 p-8"
                >
                  {item.image && (
                    <div className="mb-6">
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="object-cover w-full h-48 rounded-xl"
                      />
                    </div>
                  )}
                  <h5 className={`mb-2 text-2xl font-bold ${item.status === 'lost' ? 'text-red-500' : 'text-green-500'}`}>
                    {item.status === 'lost' ? `Lost: ${item.itemName}` : `Found by: ${item.itemName}`}
                  </h5>
                  <p className="text-gray-600 text-lg mb-6 flex-1">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-4">
                    <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                      See More
                    </button>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-xl">No items found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 mx-1 rounded-lg bg-gray-800 text-white"
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 rounded-lg ${
                  currentPage === index + 1 ? 'bg-indigo-600' : 'bg-gray-800'
                } text-white`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 mx-1 rounded-lg bg-gray-800 text-white"
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
