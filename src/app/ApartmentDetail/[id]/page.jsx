"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  MapPin,
  Users,
  Wifi,
  Car,
  Utensils,
  Tv,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ApartmentDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // пока что mock
  const apartment = {
    id: parseInt(id),
    title: "Modern Shared Apartment",
    district: "Mitte, Berlin",
    price: 650,
    rooms: 3,
    description: "Beautiful modern apartment perfect for students...",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center",
    ],
    amenities: [
      { icon: Wifi, name: "High-speed WiFi" },
      { icon: Car, name: "Parking Available" },
      { icon: Utensils, name: "Fully Equipped Kitchen" },
      { icon: Tv, name: "Smart TV" },
    ],
    roommates: [
      { name: "Anna", age: 22, university: "TU Berlin" },
      { name: "Marco", age: 24, university: "Humboldt University" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* back button */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-slate-600 hover:text-emerald-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </button>

          {/* Apartment details */}
          <h1 className="text-3xl font-bold mb-4">{apartment.title}</h1>
          <p className="text-gray-600 mb-2">{apartment.district}</p>
          <p className="text-emerald-600 font-semibold mb-4">
            €{apartment.price}/month
          </p>
          <p className="mb-6">{apartment.rooms} rooms</p>

          <img
            src={apartment.images[0]}
            alt={apartment.title}
            className="rounded-xl mb-6"
          />

          <p className="text-gray-700 mb-6">{apartment.description}</p>

          {/* Amenities */}
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <ul className="grid grid-cols-2 gap-4 mb-8">
            {apartment.amenities.map((a, i) => (
              <li key={i} className="flex items-center text-gray-600">
                <a.icon className="h-5 w-5 mr-2 text-emerald-600" />
                {a.name}
              </li>
            ))}
          </ul>

          {/* Roommates */}
          <h2 className="text-xl font-semibold mb-4">Roommates</h2>
          <ul className="space-y-2">
            {apartment.roommates.map((r, i) => (
              <li key={i} className="text-gray-700">
                {r.name}, {r.age} — {r.university}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
