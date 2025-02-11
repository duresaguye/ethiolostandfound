"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Loader from '../../components/Loader';
import { debounce } from 'lodash';

interface Item {
  id: string;
  itemName: string;
  description: string;
  status: 'lost' | 'found';
  image?: string;
  location: string;
  date: string;
}

const LostItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 15;
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status: 'lost',
        search: searchQuery,
        sort: 'date_desc'
      });

      const response = await fetch(`/api/items?${params}`);
      if (!response.ok) throw new Error('Failed to fetch items');
      
      const data = await response.json();
      setItems(data.items);
      setTotalPages(data.totalPages);
      setError('');
    } catch (error) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, itemsPerPage]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchItems();
    return () => abortController.abort();
  }, [fetchItems]);

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  if (isPending || loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-center text-red-500 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-gray-800 dark:text-gray-100">
            Lost Items
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Browse through reported lost items.
          </p>
        </header>

        <div className="mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search lost items..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-6 py-4 border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          />
        </div>

        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-gray-700 transition-shadow duration-300 overflow-hidden flex flex-col min-h-[300px] bg-white dark:bg-gray-800"
                >
                  <Link href={`/item/${item.id}`} className="flex flex-col flex-1 p-6">
                    {item.image && (
                      <div className="mb-4 relative h-48">
                        <Image
                          src={item.image}
                          alt={item.itemName}
                          fill
                          className="object-cover rounded-xl"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                      Lost: {item.itemName}
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

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 mx-1 rounded-lg bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 mx-1 rounded-lg bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              No lost items found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostItems;