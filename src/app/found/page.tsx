"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Loader from '../../components/Loader';
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

const FoundItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/items`);
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

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const filteredItems = items
    .filter(
      (item) =>
        item.status === 'found' &&
        (item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  if (isPending || loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-gray-800 dark:text-gray-100">
            Found Items
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Browse through reported found items.
          </p>
        </header>

        {/* Search Input */}
        <div className="mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search found items..."
            onChange={handleSearchChange}
            className="w-full px-6 py-4 border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          />
        </div>

        {/* Items Grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-gray-700 transition-shadow duration-300 overflow-hidden flex flex-col min-h-[300px] bg-white dark:bg-gray-800"
              >
                <Link href={`/item/${item.id}`} className="flex flex-col flex-1 p-6">
                  {item.image && (
                    <div className="mb-4">
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="object-cover w-full h-48 rounded-xl"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                    Found: {item.itemName}
                  </h2>
                  <p className="text-lg mb-4 line-clamp-4 flex-1 text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-4">
                    <button className="w-full px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300">
                      See More
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              No found items Posted.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 mx-1 rounded-lg bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
                  currentPage === index + 1 
                    ? 'bg-indigo-600 dark:bg-indigo-600' 
                    : 'bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600'
                } text-white`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 mx-1 rounded-lg bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
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

export default FoundItems;