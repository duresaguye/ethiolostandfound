"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Item } from "../../../types/item";
import Loader from "../../../components/Loader";
import { authClient } from "../../../../lib/auth-client";

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
      <p className="text-center text-red-500 p-6 bg-red-100 rounded-lg max-w-md mx-auto mt-12">
        {error}
      </p>
    );
  }

  if (!item) {
    return (
      <p className="text-center  p-6 mt-12">Item not found</p>
    );
  }

  const formattedDate = new Date(item.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b  p-8">
      <div className="max-w-4xl mx-auto">
        <div className=" rounded-3xl shadow-xl p-8 sm:p-12 lg:p-16 transition-all duration-300 hover:shadow-2xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center ">
                  No Image Available
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              {/* Item Details and Status */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold ">
                    {item.itemName}
                  </h2>
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
                <p className="leading-relaxed mt-4 ">
                  {item.description}
                </p>
              </div>

              {/* Item Information */}
              <div className="p-5  rounded-xl">
                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium ">Date</dt>
                    <dd className="mt-1 text-lg font-semibold ">
                      {formattedDate}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium ">
                      Location
                    </dt>
                    <dd className="mt-1 text-lg font-semibold ">
                      {item.location}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Contact & Additional Info */}
              <div className="p-5  rounded-xl">
                <h3 className="text-lg font-semibold mb-3">
                  {item.status === "lost"
                    ? "If You Found This Item"
                    : "If This Is Your Item"}
                </h3>
                <p className="">
                  {item.status === "lost"
                    ? "Please contact the owner with the details below:"
                    : "Please reach out to claim your item:"}
                </p>
                <ul className="mt-2 space-y-2 ">
                  <li>
                    📞 <span className="font-semibold">{item.contact}</span>
                  </li>
                  <li>📍 {item.location}</li>
                  <li>📆 {formattedDate}</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 w-full">
                <a
                  href={`tel:${item.contact}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  📞 Call
                </a>
                <a
                  href={`sms:${item.contact}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:bg-green-700 transition duration-300"
                >
                  ✉️ Send SMS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
