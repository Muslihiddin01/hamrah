"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  useEditUserByIdMutation,
  usePostApartmentMutation,
} from "@/features/api";
import { useForm } from "react-hook-form";
import { SimpleSelect } from "../components/SimpleSelect";

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
  const [editUser] = useEditUserByIdMutation();

  // Безопасно берём userId из state
  const userId = user?.id ?? null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  async function addNewApartMent(data) {
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const apartmentId = Date.now().toString();

    const dataWithId = {
      ...data,
      id: apartmentId,
    };

    const apartmentWithUserId = {
      ...dataWithId,
      userId: userId,
      images: [{ imageName: dataWithId.images, id: Date.now().toString() }],
      createAt: Date.now().toString(),
    };

    const updatedUser = {
      ...user,
      apartments: [...user.apartments, dataWithId?.id],
    };

    try {
      await postApartment(apartmentWithUserId).unwrap();
      await editUser({ id: userId, data: updatedUser }).unwrap();
      console.log("Apartment added:", apartmentWithUserId);
    } catch (error) {
      console.error("Error adding apartment:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main>
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Apartment Details
              </h2>

              <form
                className="space-y-8"
                onSubmit={handleSubmit(addNewApartMent)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Title
                    </label>
                    <input
                      type="text"
                      {...register("title", { required: "Title is required" })}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="Cozy 2-Bedroom Apartment near Campus"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Description
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 font-['Open_Sans'] min-h-[120px] max-h-[240px]"
                      placeholder="Describe your apartment, neighborhood, and what makes it special..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Max People
                    </label>
                    <SimpleSelect
                      {...register("maxPeople", {
                        required: "Please select number of maxPeople",
                      })}
                      value={watch("maxPeople") || ""}
                      onChange={(value) => setValue("maxPeople", value)}
                      placeholder="Select number of maxPeople"
                      className="w-full"
                    >
                      <Option value="">Select MaxPeople</Option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <Option key={num} value={num}>
                          {num}
                        </Option>
                      ))}
                    </SimpleSelect>
                    {errors.maxPeople && (
                      <p className="text-red-500 text-sm">
                        {errors.maxPeople.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Rooms
                    </label>
                    <SimpleSelect
                      {...register("rooms", {
                        required: "Please select number of rooms",
                      })}
                      value={watch("rooms") || ""}
                      onChange={(value) => setValue("rooms", value)}
                      placeholder="Select number of rooms"
                      className="w-full"
                    >
                      <Option value="">Select number of rooms</Option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <Option key={num} value={num}>
                          {num}
                        </Option>
                      ))}
                    </SimpleSelect>
                    {errors.rooms && (
                      <p className="text-red-500 text-sm">
                        {errors.rooms.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Area (m²)
                    </label>
                    <input
                      type="number"
                      {...register("area", { required: "Area is required" })}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="75"
                    />
                    {errors.area && (
                      <p className="text-red-500 text-sm">
                        {errors.area.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Floor
                    </label>
                    <input
                      type="number"
                      {...register("floor", { required: "Floor is required" })}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="3"
                    />
                    {errors.floor && (
                      <p className="text-red-500 text-sm">
                        {errors.floor.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Price (somoni)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-['Open_Sans']">
                        TJS
                      </span>
                      <input
                        type="number"
                        {...register("price", {
                          required: "Price is required",
                        })}
                        className="w-full border border-gray-300 rounded-xl pl-12 p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                        placeholder="1500"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      City
                    </label>
                    <SimpleSelect
                      {...register("city", { required: "City is required" })}
                      value={watch("city") || ""}
                      onChange={(value) => setValue("city", value)}
                      placeholder="Select a city"
                      className="w-full"
                    >
                      <Option value="">Select a city</Option>
                      <Option value="Dushanbe">Dushanbe</Option>
                      <Option value="Kulob">Kulob</Option>
                      <Option value="Hisor">Hisor</Option>
                      <Option value="Khujand">Khujand</Option>
                      <Option value="Vahdat">Vahdat</Option>
                    </SimpleSelect>
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      District
                    </label>
                    <input
                      type="text"
                      {...register("district", {
                        required: "District is required",
                      })}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="Firdavsi"
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm">
                        {errors.district.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Address
                    </label>
                    <input
                      type="text"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="Rudaki Avenue 12"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']">
                      Image (Base64 or URL)
                    </label>
                    <input
                      type="text"
                      {...register("images", { required: "Image is required" })}
                      className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-['Open_Sans']"
                      placeholder="Paste image URL or Base64 string"
                    />
                    {errors.images && (
                      <p className="text-red-500 text-sm">
                        {errors.images.message}
                      </p>
                    )}
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
