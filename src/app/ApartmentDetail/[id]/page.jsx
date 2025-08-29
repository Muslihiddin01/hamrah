"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { MapPin, ArrowLeft } from "lucide-react";
import { useGetApartmentByIdQuery } from "@/features/api";

export default function ApartmentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { data: apartmentById } = useGetApartmentByIdQuery(id, { skip: !id });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const apartment = Array.isArray(apartmentById)
    ? apartmentById[0]
    : apartmentById;

  if (!apartment) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-slate-600 hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад к поиску
        </button>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Left Column (Main Content) */}
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {apartment?.title}
            </h1>
            <p className="text-gray-600 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              {apartment?.district}
            </p>

            {/* Main Image */}
            <div className="w-full mb-4">
              <img
                src={apartment?.images}
                alt={apartment?.title}
                className="w-full h-auto rounded-lg shadow-md"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 mb-8">
              {/* This section would be dynamically generated from data.images */}
              {apartment.images && Array.isArray(apartment?.images) > 0 ? (
                apartment.images.map((image, i) => {
                  return (
                    <img
                      key={i}
                      src={apartment.image || "/no picture.webp"}
                      alt={`Apartment in ${apartment.district}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="192"
                    />
                  );
                })
              ) : (
                <img 
                  src={apartment.images || "/no picture.webp"}
                  loading="lazy"
                  decoding="async"
                  width="100"
                  height="192"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={`Apartment in ${apartment.district}`}
                />
              )}
            </div>

            {/* Apartment Details Table */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <table className="w-full text-left text-gray-700">
                <tbody>
                  <tr>
                    <td className="font-semibold py-2">Этаж:</td>
                    <td className="py-2">7</td>
                    <td className="font-semibold py-2">Отопление:</td>
                    <td className="py-2">Нет</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Ремонт:</td>
                    <td className="py-2">Новый ремонт</td>
                    <td className="font-semibold py-2">Срок предоплаты:</td>
                    <td className="py-2">Без предоплаты</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Площадь:</td>
                    <td className="py-2">55 м²</td>
                    <td className="font-semibold py-2">Домашние животные:</td>
                    <td className="py-2">Запрещены</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Санузел:</td>
                    <td className="py-2">Совмещенный</td>
                    <td className="font-semibold py-2">Тип застройки:</td>
                    <td className="py-2">Новостройка</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Район:</td>
                    <td className="py-2">{apartment?.district}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Описание</h2>
              <p className="text-gray-700">
                Сдается{" "}
                <span className="font-semibold">{apartment?.rooms}</span>{" "}
                квартира со всеми удобствами для порядочных людей. квартира
                находится рядом магазин Амид.
              </p>
            </div>
          </div>

          {/* Right Column (Contact & Info) */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-emerald-600 p-6 rounded-xl shadow-md text-white text-center mb-4">
              <span className="text-3xl font-bold">{apartment?.price} €</span>
              <span className="block text-sm"> / месяц</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-4">
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center mb-2 hover:bg-blue-700 transition-colors">
                Показать телефон
              </button>
              <button className="w-full bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                <img
                  src="/whatsapp-icon.png"
                  alt="Whatsapp"
                  className="h-6 w-6 mr-2"
                />
                Whatsapp
              </button>
            </div>

            {/* Other info block (e.g., ad info) */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  На сайте с Май, 2024
                </span>
              </div>
              <button className="text-blue-600 hover:underline">
                Другие объявления автора
              </button>
              <button className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg mt-4 hover:bg-gray-300 transition-colors">
                Пожаловаться
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
