"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useGetUserByIdQuery, usePostApartmentMutation } from "@/features/api";
import { useForm } from "react-hook-form";

export default function AddApartment() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const [postApartment] = usePostApartmentMutation();
  const userId = JSON.parse(localStorage.getItem("user")).id ?? null;

  const { data: userById } = useGetUserByIdQuery(userId, { skip: !userId });
  const userApartment = Array.isArray(userById)
    ? userById[0]?.apartments ?? []
    : userById?.apartments ?? [];


  const { register, handleSubmit } = useForm();

  async function addNewApartMent(data) {
    const apartmentWithUserId = {
      userId: userId,
      ...data,
      images: [{ imageName: data.images, id: Date.now().toString() }],
      createAt: Date.now().toString(),
    };

    try {
      await postApartment(apartmentWithUserId);
      userApartment.push(apartmentWithUserId)
      console.log(apartmentWithUserId);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50 to-sky-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-['Inter']">
              Add a New <span className="text-emerald-600">Apartment</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto font-['Open_Sans']">
              Fill out the details below to create a new listing. Connect with fellow students and help them find their perfect home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-['Open_Sans']">
                  Easy listing process
                </span>
              </div>
              <div className="flex items-center text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-['Open_Sans']">Reach thousands of students</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 font-['Inter']">
                Apartment Details
              </h2>
              <p className="text-slate-600 mb-8 font-['Open_Sans']">
                Provide detailed information about your apartment to attract potential roommates.
              </p>

              <form
                className="space-y-8"
                onSubmit={handleSubmit(addNewApartMent)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">Title</label>
                    <input
                      type="text"
                      {...register("title")}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="Cozy 2-Bedroom Apartment near Campus"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="Describe your apartment, neighborhood, and what makes it special..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Max People
                    </label>
                    <input
                      type="number"
                      {...register("maxPeople")}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">Rooms</label>
                    <input
                      type="number"
                      {...register("rooms")}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Area (m²)
                    </label>
                    <input
                      type="number"
                      {...register("area")}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="75"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">Floor</label>
                    <input
                      type="number"
                      {...register("floor")}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="3"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Price (somoni)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-['Open_Sans']">TJS</span>
                      <input
                        type="number"
                        {...register("price")}
                        className="w-full border border-gray-300 rounded-xl pl-12 p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                        placeholder="1500"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Amenities (comma separated)
                    </label>
                    <input
                      type="text"
                      {...register("amenities")}
                      placeholder="WiFi, AirConditioner, Parking, WashingMachine"
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Image (Base64 or URL)
                    </label>
                    <input
                      type="text"
                      {...register("images")}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="Paste image URL or Base64 string"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-medium font-['Inter'] transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Add Apartment
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
