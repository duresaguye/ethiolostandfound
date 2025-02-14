"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Item } from "../../../types/item";
import Loader from "../../../components/Loader";
import { authClient } from "../../../../lib/auth-client";

const ItemDetails: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session, isPending } = authClient.useSession();

  // Session management
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Memoized date formatting
  const formattedDate = useMemo(() => {
    if (!item?.date) return "";
    return new Date(item.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [item?.date]);

  // Data fetching with error handling
  const fetchItem = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items/${id}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error("Item not found");
        throw new Error(`Error ${response.status}`);
      }
      const data = await response.json();
      setItem(data.item);
      setError("");
    } catch (error: any) {
      setError(error.message || "Failed to fetch item details");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch data when session is available
  useEffect(() => {
    if (session) fetchItem();
  }, [session, fetchItem]);

  // Loading and error states
  if (isPending || loading) return <Loader />;
  if (error) return <ErrorDisplay message={error} />;
  if (!item) return <ErrorDisplay message="Item not found" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-700/30 p-8 sm:p-12 lg:p-16 transition-all duration-300 hover:shadow-2xl">
          <div className="grid gap-8 md:grid-cols-2">
            <ImageSection image={item.image} itemName={item.itemName} />
            
            <div className="space-y-8">
              <ItemHeader item={item} formattedDate={formattedDate} />
              
              <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <InfoGrid item={item} formattedDate={formattedDate} />
              </div>

              <ContactSection item={item} formattedDate={formattedDate} />
              
              <ActionButtons contact={item.contact} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for better readability
const ImageSection = ({ image, itemName }: { image?: string; itemName: string }) => (
  <div className="relative group overflow-hidden rounded-2xl aspect-square">
    {image ? (
      <Image
        src={image}
        alt={itemName}
        fill
        className="object-cover transform transition-all duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
        No Image Available
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
  </div>
);

const ItemHeader = ({ item, formattedDate }: { item: Item; formattedDate: string }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        {item.itemName}
      </h2>
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
        item.status === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"
      }`}>
        {item.status === "lost" ? "Lost" : "Found"}
      </span>
    </div>
    <p className="leading-relaxed mt-4 text-gray-600 dark:text-gray-300">
      {item.description}
    </p>
  </div>
);

const InfoGrid = ({ item, formattedDate }: { item: Item; formattedDate: string }) => (
  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <div>
      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {formattedDate}
      </dd>
    </div>
    <div>
      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {item.location}
      </dd>
    </div>
  </dl>
);

const ContactSection = ({ item, formattedDate }: { item: Item; formattedDate: string }) => (
  <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
      {item.status === "lost" ? "If You Found This Item" : "If This Is Your Item"}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {item.status === "lost" 
        ? "Please contact the owner with the details below:" 
        : "Please reach out to claim your item:"}
    </p>
    <ul className="mt-2 space-y-2 text-gray-700 dark:text-gray-300">
      <li>📞 <span className="font-semibold">{item.contact}</span></li>
      <li>📍 {item.location}</li>
      <li>📆 {formattedDate}</li>
    </ul>
  </div>
);

const ActionButtons = ({ contact }: { contact: string }) => (
  <div className="flex gap-4 w-full">
    <a
      href={`tel:${contact}`}
      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300"
    >
      📞 Call
    </a>
    <a
      href={`sms:${contact}`}
      className="flex-1 flex items-center justify-center gap-2 bg-green-600 dark:bg-green-700 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:bg-green-700 dark:hover:bg-green-800 transition duration-300"
    >
      ✉️ Send SMS
    </a>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-center text-red-500 p-6 bg-red-100 rounded-lg max-w-md mx-auto">
      {message}
    </p>
  </div>
);

export default ItemDetails;