"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { User, Lock, Calendar, Eye, EyeOff } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePostUserMutation } from "@/features/api";

// схема валидации
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "You must be at least 18 years old").max(100),
  city: z.string().min(1, "Select your city"),
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .or(z.literal("").transform(() => undefined))
    .optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [postUser] = usePostUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    if (!data.avatar) data.avatar = "";
    const fullUser = {
      ...data,
      apartments: [],
      favorites: [],
      createAt: Date.now().toString(),
    };
    try {
      const newUser = await postUser(fullUser).unwrap();
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success("Registration successful! 🎉");
      router.push("/");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                Join StudentFlats
              </h1>
              <p className="text-slate-600 mt-2">
                Create your account to start finding roommates
              </p>
            </div>

            {/* форма */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Muhammad"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("age", {
                      valueAsNumber: true,
                      min: 17,
                      max: 99,
                    })}
                    type="number"
                    placeholder="22"
                    min={17}
                    max={99}
                    onKeyDown={(e) => {
                      if (["-", "+", "e", "E"].includes(e.key))
                        e.preventDefault();
                    }}
                    onInput={(e) => {
                      const target = e.target;
                      if (target.value > 99)
                        target.value = 99 && alert("Max is 99, sorry");
                      else if (target.value < 1) target.value = "";
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                      errors.age ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* // city  */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select your city
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    {...register("city")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                      errors.city ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="Dushanbe">Dushanbe</option>
                    <option value="Kulob">Kulob</option>
                    <option value="Khujand">Khujand</option>
                    <option value="Vahdat">Vahdat</option>
                    <option value="Kurgantupe">Kurgantupe</option>
                    <option value="Hisor">Hisor</option>
                  </select>
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Add Image (oprional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("avatar")}
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    minLength={4}
                    maxLength={10}
                    placeholder="Maga2211"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
