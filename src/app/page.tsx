"use client";
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "../../lib/auth-client";
import Loader from '../components/Loader';
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
  const { data: session, isPending } = authClient.useSession();
  const itemsPerPage = 15;
  const router = useRouter();

  // Fetch items from API on component mount
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
  const handleSearchChange = useMemo(() => debounce((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }, 500), []);

  // Memoize filtered items to avoid re-calculations
  const filteredItems = useMemo(() => {
    return items
      .filter((item) =>
        (filter === 'all' || item.status === filter) &&
        (item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (item.location.toLowerCase().includes(locationQuery.toLowerCase()))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [items, filter, searchQuery, locationQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
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
    
    <div className="container mx-auto p-4 text-gray-100">
      <section className="text-center mb-6 p-6">
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
        <p className="text-xl mb-6">
          Discover a world of lost and found treasures! Whether you are searching for a lost item or want to help reunite others with their belongings, you are in the right place.
        </p>
      </section>

      <section className="flex justify-center items-center mb-3">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 mr-2 bg-gray-800 rounded-lg focus:outline-none text-white"
        />
      
      </section>

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

      <h2 className="text-4xl font-bold mb-2 text-center">Lost and Found Items</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div
              key={item.id}
              className="relative max-w-sm text-white border border-gray-200 rounded-lg shadow transition-transform duration-300 hover:scale-105 hover:border-blue-500 cursor-pointer"
            >
              {item.image && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold text-green-500">
                  {item.itemName}
                </h5>
                <h5 className="mb-2 text-2xl font-bold text-green-500">
                  {item.description}
                </h5>
                <Link
                  href={`/item/${item.id}`}
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      router.push(`/login?redirect=${encodeURIComponent(`/item/${item.id}`)}`);
                    }
                  }}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition duration-300"
                >
                  See More
                  <svg
                    className="w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No items found.</p>
        )}
      </div>

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
            className={`px-4 py-2 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-indigo-600' : 'bg-gray-800'} text-white`}
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
    </div>
  );
};

export default Home;
