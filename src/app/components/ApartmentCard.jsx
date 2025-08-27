import React from "react";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";

const ApartmentCard = ({ apartment }) => {
  return (
    <Link href={`/ApartmentDetail/${apartment.id}`} className="group" role="button">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={apartment.image}
            alt={`Apartment in ${apartment.district}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            width="400"
            height="192"
          />
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
            €{apartment.price}/month
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm font-['Open_Sans']">
              {apartment.district}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-3 font-['Inter'] group-hover:text-emerald-600 transition-colors">
            {apartment.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm font-['Open_Sans']">
                {apartment.rooms} rooms
              </span>
            </div>

            <div className="text-emerald-600 font-semibold font-['Inter']">
              View Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ApartmentCard;
