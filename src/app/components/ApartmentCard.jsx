"use client";
import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users } from "lucide-react";
import PostTime from "./PostTime";
import AddFavorite from "./AddFavorite";
import Image from "next/image";

const ApartmentCard = ({ apartment }) => {
  const router = useRouter();

  // ⚡ Берём user один раз и мемоизируем
  const user = useMemo(() => {
    if (typeof window === "undefined") return null; // чтобы SSR не падал
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }, []);

  // ⚡ useCallback для стабильности ссылки
  const handleCardClick = useCallback(() => {
    router.push(`/ApartmentDetail/${apartment.id}`);
  }, [router, apartment.id]);

  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        {apartment.images?.length > 0 ? (
          <Image
            width={100}
            height={100}
            src={apartment.images[0].imageName}
            alt={`Apartment in ${apartment.district}`}
            className="w-full h-72 object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Image
            width={100}
            height={100}
            src="/no picture.webp"
            alt={`Apartment in ${apartment.district}`}
            className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
          {apartment.price}c.
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm font-['Open_Sans']">
            {apartment.city} • {apartment.district}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-3 font-['Inter'] group-hover:text-emerald-600 transition-colors">
          {apartment.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm font-['Open_Sans']">
              {apartment.rooms} rooms
            </span>
          </div>

          <PostTime createAt={apartment.createAt} />
        </div>

        <div className="text-emerald-600 font-semibold font-['Inter'] flex items-center justify-between gap-5">
          <span>View Details</span>
          {/* ⚡ Передаём и userId, и apartmentId */}
          <AddFavorite userId={user?.id ?? null} apartmentId={apartment.id} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ApartmentCard);
