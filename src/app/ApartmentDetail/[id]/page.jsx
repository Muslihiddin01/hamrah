"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { MapPin, ArrowLeft } from "lucide-react";
import { useGetApartmentByIdQuery, useGetUserByIdQuery } from "@/features/api";
import Image from "next/image";

export default function ApartmentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { data: apartmentById } = useGetApartmentByIdQuery(id, { skip: !id });
  const { data: userById } = useGetUserByIdQuery(id, { skip: !id });

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

  const userProfile = Array.isArray(userById) ? userById[0] : userById;

  function formatCreateAt(createAt) {
    // Если приходит число — превращаем в Date
    const date =
      typeof createAt === "number" ? new Date(createAt) : new Date(createAt);

    // Массив месяцев на русском
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `На сайте с ${month}, ${year}`;
  }

  if (!apartment && !userProfile) return null;

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
            <div className="w-full mb-4 md:h-[600px] flex items-center justify-center bg-gray-200 rounded-lg">
              <img
                src={apartment?.images?.[0]?.imageName || "/no picture.webp"}
                alt={apartment?.title}
                className="w-fit h-full shadow-md max-w-full"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 mb-8">
              {apartment?.images && apartment.images.length > 0 ? (
                apartment.images
                  .slice(0, 8)
                  .map((image, i) => (
                    <img
                      key={i}
                      src={image.imageName || "/no picture.webp"}
                      alt={`Apartment in ${apartment.district}`}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300 rounded"
                      loading="lazy"
                      decoding="async"
                    />
                  ))
              ) : (
                <img
                  src="/no picture.webp"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-24 object-cover rounded"
                  alt="No picture"
                />
              )}
            </div>

            {/* Apartment Details Table */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <table className="w-full text-left text-gray-700">
                <tbody>
                  <tr>
                    <td className="font-semibold py-2">Этаж:</td>
                    <td className="py-2">{apartment?.floor || "—"}</td>
                    <td className="font-semibold py-2">Отопление:</td>
                    <td className="py-2">{apartment?.heating || "—"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Ремонт:</td>
                    <td className="py-2">{apartment?.repair || "—"}</td>
                    <td className="font-semibold py-2">Срок предоплаты:</td>
                    <td className="py-2">{apartment?.prepayment || "—"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Площадь:</td>
                    <td className="py-2">
                      {apartment?.area ? `${apartment.area} м²` : "—"}
                    </td>
                    <td className="font-semibold py-2">Домашние животные:</td>
                    <td className="py-2">{apartment?.petsAllowed || "—"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Санузел:</td>
                    <td className="py-2">{apartment?.bathroom || "—"}</td>
                    <td className="font-semibold py-2">Тип застройки:</td>
                    <td className="py-2">{apartment?.buildingType || "—"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Район:</td>
                    <td className="py-2" colSpan={3}>
                      {apartment?.district || "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Описание</h2>
              <p className="text-gray-700">{apartment?.description}</p>
            </div>
          </div>

          {/* Right Column (Contact & Info) */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-xl shadow-md mb-4">
              <button className="w-full bg-[#FFC700] font-bold py-4 text-lg rounded-lg flex items-center justify-center mb-2 hover:bg-[#E6B600] transition-colors">
                {apartment?.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                c.
              </button>
              <button className="w-full bg-blue-600 text-white font-bold py-4 text-lg rounded-lg flex items-center justify-center mb-2 hover:bg-blue-700 transition-colors">
                <span>
                  +992{" "}
                  {`${userProfile?.contacts.slice(
                    0,
                    2
                  )}-${userProfile?.contacts.slice(
                    2,
                    5
                  )}-${userProfile?.contacts.slice(
                    5,
                    7
                  )}-${userProfile?.contacts.slice(7, 9)}`}
                </span>
              </button>
              <button className="w-full bg-green-500 text-white font-bold py-4 text-lg rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 mr-2"
                >
                  <path d="M12 .5C5.648.5.5 5.648.5 12c0 2.118.557 4.187 1.615 6.01L.5 23.5l5.646-1.58A11.46 11.46 0 0 0 12 23.5c6.352 0 11.5-5.148 11.5-11.5S18.352.5 12 .5Zm0 20.59c-1.905 0-3.754-.512-5.362-1.48l-.383-.228-3.35.938.92-3.427-.25-.395A9.483 9.483 0 0 1 2.5 12c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5Zm4.958-7.184c-.271-.135-1.605-.793-1.854-.883-.249-.092-.43-.135-.61.135-.181.27-.699.884-.857 1.065-.159.18-.317.202-.588.067-.27-.135-1.14-.42-2.172-1.34-.803-.717-1.344-1.603-1.502-1.873-.158-.27-.017-.416.12-.55.124-.124.27-.317.405-.476.135-.158.18-.27.271-.45.09-.18.045-.338-.022-.475-.067-.135-.61-1.472-.835-2.015-.22-.528-.444-.456-.61-.465l-.52-.009c-.18 0-.474.067-.72.338-.249.27-.947.925-.947 2.255s.97 2.617 1.105 2.797c.135.18 1.91 2.918 4.627 4.09.647.28 1.152.446 1.544.57.649.207 1.239.178 1.707.108.52-.078 1.605-.656 1.83-1.289.226-.633.226-1.174.158-1.289-.067-.113-.248-.18-.52-.315Z" />
                </svg>
                Whatsapp
              </button>
            </div>

            {/* Other info block (e.g., ad info) */}

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-3 flex items-center gap-3">
                {userProfile.avatar && (
                  <Image
                    src={userProfile.avatar}
                    width={50}
                    height={50}
                    alt="userImage"
                    className="rounded-full hover:opacity-90"
                  />
                )}
                <span className="text-xl">{userProfile.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {formatCreateAt(userProfile.createAt)}
                </span>
              </div>

              <button
                onClick={() => router.push(`/userPosts/${id}`)}
                className="text-blue-600 hover:underline cursor-pointer hover:text-blue-800"
              >
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
