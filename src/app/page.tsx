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
  const [lostCount, setLostCount] = useState<number>(0);
  const [foundCount, setFoundCount] = useState<number>(0);
  const itemsPerPage = 15;
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/items?limit=20&sort=date_desc');
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
  
          // Calculate lost and found counts
            const lostItems: Item[] = data.items.filter((item: Item) => item.status === 'lost');
            const foundItems: Item[] = data.items.filter((item: Item) => item.status === 'found');
          
          setLostCount(lostItems.length);
          setFoundCount(foundItems.length);
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
  

  const handleSearchChange = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1);
    }, 500),
    []
  );

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
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold m-4 ">
            <span className="text-green-600 dark:text-green-400">Welcome to </span>
            <span className="text-yellow-600 dark:text-yellow-400">Ethiolost</span>
            <img
              src="/Emblem_of_Ethiopia.svg.png"
              alt="Emblem of Ethiopia"
              className="w-10 h-10 inline-block align-middle ml-2"
            />
            <span className="text-red-600 dark:text-red-400"> Found!</span>
          </h1>

          <p className="text-xl font-medium mb-8 text-gray-600 dark:text-gray-300">
  🔍 Discover a world of lost and found treasures! Whether you're searching for a lost item or want to help reunite others with their belongings, you're in the right place.
</p>
<p className="text-lg text-gray-700 dark:text-gray-300">
  Ready to share your story? <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold">Log in or sign up</Link> to post your lost or found item!
</p>



          {/* Stats Section */}
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

            <div className="mt-6">
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

        <div className="mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search items..."
            onChange={handleSearchChange}
            className="w-full px-6 py-4 border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          />
        </div>

        {/* Recently Posted Section */}
        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mx-4">Recently Posted Lost and Found Items</h2>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-gray-700 transition-shadow duration-300 overflow-hidden flex flex-col min-h-[300px] cursor-pointer bg-white dark:bg-gray-800"
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
                  <h5 className={`mb-2 text-2xl font-bold ${item.status === 'lost' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                    {item.status === 'lost' ? `Lost: ${item.itemName}` : `Found: ${item.itemName}`}
                  </h5>
                  <p className="text-lg mb-4 flex-1 text-gray-600 dark:text-gray-300">{item.description}</p>
                  <button className="w-full px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300">
                    See More
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">No items found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;