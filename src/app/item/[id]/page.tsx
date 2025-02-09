"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Item } from "../../../types/item";
import Loader from "../../../components/Loader";
import { authClient } from "../../../../lib/auth-client";
import { useRouter } from "next/navigation";

const ItemDetails: React.FC = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/items/${id}`);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setItem(data.item);
      } catch (error: any) {
        setError(`Failed to fetch item: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchItem();
    }
  }, [id, session]);

  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 p-8 bg-red-50 rounded-lg max-w-md mx-auto mt-12">
        {error}
      </p>
    );
  }

  if (!item) {
    return (
      <p className="text-center text-gray-500 p-8 mt-12">Item not found</p>
    );
  }

  // Format the date using toLocaleDateString
  const formattedDate = new Date(item.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b py-12 px-4 sm:px-6 lg:px-8 text-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl shadow-xl p-8 sm:p-12 lg:p-16 transition-all duration-300 hover:shadow-2xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold mb-4">Item Details</h2>

                {/* Status Label */}
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    item.status === "lost"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {item.status === "lost" ? "Lost" : "Found"}
                </span>
              </div>

              <div className="space-y-6">
                <div className="p-5 rounded-xl">
                  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium">Date</dt>
                      <dd className="mt-1 text-lg font-semibold">
                        {formattedDate}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium">Location</dt>
                      <dd className="mt-1 text-lg font-semibold">
                        {item.location}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Conditional Rendering of Additional Information */}
                {item.status === "lost" ? (
                  <div className="p-5 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-50 mb-3">
                      Additional Information
                    </h3>
                    <p>
                      If You Found This Item, please contact us with the
                      following details:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>• Contact: {item.contact}</li>
                      <li>• Item Name: {item.itemName}</li>
                    </ul>
                  </div>
                ) : item.status === "found" ? (
                  <div className="p-5 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-50 mb-3">
                      Additional Information
                    </h3>
                    <p>
                      If this is your item, please contact us with the following
                      details:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>• Contact: {item.contact}</li>
                      <li>• Item Name: {item.itemName}</li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;