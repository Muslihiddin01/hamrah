"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchFilters from "../components/SearchFilters";
import ApartmentCard from "../components/ApartmentCard";
import { MapPin, Star, Users } from "lucide-react";
import { useGetApartmentsQuery } from "@/features/api";

const Home = () => {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    maxPrice: "",
    rooms: "",
  });

  const { data: apartmentss } = useGetApartmentsQuery();

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Filter apartments based on filters
  const filteredApartments = apartmentss?.filter((apartment) => {
    if (
      filters.location &&
      !apartment.city.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    if (filters.maxPrice && apartment.price > Number(filters.maxPrice))
      return false;
    if (filters.rooms && apartment.rooms !== filters.rooms)
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50 to-sky-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-['Inter']">
              Find Your Perfect{" "}
              <span className="text-emerald-600">Student Flat</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto font-['Open_Sans']">
              Connect with fellow students and discover amazing shared apartment
              opportunities. Your ideal living space is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-slate-600">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-['Open_Sans']">
                  4.8/5 from 2,000+ students
                </span>
              </div>
              <div className="flex items-center text-slate-600">
                <Users className="h-5 w-5 text-emerald-600 mr-1" />
                <span className="font-['Open_Sans']">10,000+ active users</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </section>

        {/* Interactive Map Placeholder */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-['Inter']">
                Interactive Map
              </h3>
              <p className="text-slate-600 font-['Open_Sans']">
                Explore apartment locations on our interactive map (Coming Soon)
              </p>
            </div>
          </div>
        </section>

        {/* Featured Apartments */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900 font-['Inter']">
                {filters.location || filters.maxPrice || filters.rooms
                  ? "Search Results"
                  : "Featured Apartments"}
              </h2>
              <span className="text-slate-600 font-['Open_Sans']">
                {filteredApartments?.length} apartments found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
              {filteredApartments?.map((apartment) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
              ))}
            </div>

            {filteredApartments?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg font-['Open_Sans']">
                  No apartments match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
