"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePostApartmentMutation } from "@/features/api";
import { useForm } from "react-hook-form";
import { minLength } from "zod";
export default function AddApartment() {
  // Load user from localStorage
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
  const { register, handleSubmit } = useForm();

  async function addNewApartMent(data) {
    const info = JSON.parse(localStorage.getItem("user"));
    const allUserInfo = {
      ...data,
      ...info,
    };
    try {
      await postApartment(allUserInfo);
      console.log(allUserInfo);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50 to-sky-50 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-['Inter']">
              Add a New <span className="text-emerald-600">Apartment</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-['Open_Sans']">
              Share your apartment with students looking for a place to stay.
              Fill out the details below to create a new listing.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-['Inter']">
                Apartment Details
              </h2>

              <form
                className="space-y-6"
                onSubmit={handleSubmit(addNewApartMent)}
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    placeholder="Барои студентои милли..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location / District
                  </label>
                  <input
                    type="text"
                    placeholder="Firdavsi"
                    {...register("district")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Price & Rooms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price (somoni)
                    </label>
                    <input
                      type="number"
                      {...register("price")}
                      placeholder="650"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 ">
                      Rooms
                    </label>
                    <select
                      {...register("rooms")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>

                {/* Contact  */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contacts
                  </label>
                  <input
                    type="number"
                    {...register("contacts")}
                    minLength={9}
                    maxLength={9}
                    placeholder="11-111-11-11"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="Link of your pictures"
                    {...register("images")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-emerald-700 transition"
                  >
                    Add Apartment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
