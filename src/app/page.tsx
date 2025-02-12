"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Loader from "../components/Loader";
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

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [lostCount, setLostCount] = useState<number>(0);
  const [foundCount, setFoundCount] = useState<number>(0);
  const itemsPerPage = 15;
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Fetch global counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/items/counts');
        if (response.ok) {
          const { lost, found } = await response.json();
          setLostCount(lost);
          setFoundCount(found);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    fetchCounts();
  }, []);

  // Debounced search handlers
  const debouncedSearch = useCallback(
    debounce((query: string) => setSearchQuery(query), 500),
    []
  );

  const debouncedLocation = useCallback(
    debounce((location: string) => setLocationQuery(location), 500),
    []
  );

  // Main data fetching
  useEffect(() => {
    const abortController = new AbortController();

    const fetchItems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          status: filter,
          search: searchQuery,
          location: locationQuery,
          sort: 'date_desc'
        });

        const response = await fetch(`/api/items?${params}`, {
          signal: abortController.signal
        });

        if (!response.ok) throw new Error('Failed to fetch items');
        
        const data = await response.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
        setError('');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError('Failed to fetch items. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    return () => abortController.abort();
  }, [filter, searchQuery, locationQuery, currentPage, itemsPerPage]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setCurrentPage(1);
  };

  

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || isPending) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold m-4">
            <span className="text-green-600 dark:text-green-400">Welcome to </span>
            <span className="text-yellow-600 dark:text-yellow-400">Ethiolost</span>
            <Image 
              src="/Emblem_of_Ethiopia.svg.png"
              alt="Emblem of Ethiopia"
              width={40}
              height={40}
              className="inline-block align-middle ml-2"
            />
            <span className="text-red-600 dark:text-red-400"> Found!</span>
          </h1>

          <div className="mb-8 max-w-2xl mx-auto">
            <p className="text-xl font-medium mb-8 text-gray-600 dark:text-gray-300">
              🔍 Discover a world of lost and found treasures! Whether you're searching for a lost item
              or want to help reunite others with their belongings, you're in the right place.
            </p>
          </div>

          <div className="shadow-lg rounded-2xl p-6 mb-6 transition-all hover:shadow-xl dark:bg-gray-800 dark:hover:shadow-gray-700">
            <div className="flex justify-center gap-8 mb-4">
              <div className="text-center px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600">
                <p className="text-sm font-semibold text-red-600 dark:text-red-300 mb-1">📌 Lost Items</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{lostCount}</p>
              </div>

              <div className="text-center px-6 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-600">
                <p className="text-sm font-semibold text-green-600 dark:text-green-300 mb-1">🎉 Found Items</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{foundCount}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <Link
                href="/post"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 text-white rounded-lg
                      font-semibold hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 transition-all"
              >
                📢 Report Lost/Found Item
                <span className="ml-2 text-lg">→</span>
              </Link>

            </div>

            <p className="mt-4 text-md text-gray-600 dark:text-gray-400">
              Together we've reunited 🔗 {lostCount + foundCount} items with their owners!
            </p>
          </div>
        </header>

        <div className="mb-12 max-w-2xl mx-auto space-y-4">
          <input
            type="text"
            placeholder="Search items..."
            onChange={handleSearchChange}
            className="w-full px-6 py-4 border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          />
         
        </div>

        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mx-4">
            Recently Posted Lost and Found Items
          </h2>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-gray-700 transition-shadow duration-300 overflow-hidden flex flex-col min-h-[300px] cursor-pointer bg-white dark:bg-gray-800"
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
                  <h5 className={`mb-2 text-2xl font-bold ${
                    item.status === 'lost' 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-green-500 dark:text-green-400'
                  }`}>
                    {item.status === 'lost' ? `Lost: ${item.itemName}` : `Found: ${item.itemName}`}
                  </h5>
                  <p className="text-lg mb-4 flex-1 text-gray-600 dark:text-gray-300">{item.description}</p>
                  <div className="mt-auto space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      📍 {item.location} | 📅 {new Date(item.date).toLocaleDateString()}
                    </p>
                    <button className="w-full px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300">
                      See Details
                    </button>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">No items found matching your criteria.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 px-4 py-2 rounded-lg ${
                  currentPage === page 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;