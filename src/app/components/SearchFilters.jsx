"use client";
import React from "react";
import { Search, MapPin, Euro, Users } from "lucide-react";
import { SimpleSelect } from "./SimpleSelect";
const SearchFilters = ({ filters, onFiltersChange }) => {
  const handleInputChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location Search */}
        <div className="relative">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']"
          >
            City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="location"
              type="text"
              placeholder="City, district..."
              value={filters.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-['Open_Sans']"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']"
          >
            Max Price (€/month)
          </label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="maxPrice"
              type="number"
              placeholder="1000"
              value={filters.maxPrice}
              onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-['Open_Sans']"
            />
          </div>
        </div>

        {/* Number of Rooms */}
        <div>
          <label
            htmlFor="rooms"
            className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']"
          >
            Rooms
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <SimpleSelect
              value={filters.rooms}
              onChange={(value) => handleInputChange("rooms", value)}
              placeholder="Any"
              className="w-full"
            >
              <Option value="">Any</Option>
              <Option value="1">1 Room</Option>
              <Option value="2">2 Rooms</Option>
              <Option value="3">3 Rooms</Option>
              <Option value="4">4 Rooms</Option>
              <Option value="5">5+ Rooms</Option>
            </SimpleSelect>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button className="w-full bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium font-['Inter'] flex items-center justify-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
