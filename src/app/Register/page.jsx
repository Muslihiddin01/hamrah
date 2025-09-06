"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { User, Lock, Calendar, Eye, EyeOff, Phone } from "lucide-react";
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
      friends: [],
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

  useEffect(() => {
    // Запрещаем скролл при монтировании
    document.body.style.overflowY = "hidden";
    return () => {
      // Возвращаем скролл при размонтировании
      document.body.style.overflowY = "auto";
    };
  }, []);

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 content-center">
    <main className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full md:max-w-[40%]">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join StudentFlats
            </h1>
            <p className="text-gray-600 text-sm">
              Create your account to start finding roommates
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 grid grid-cols-2 gap-x-7 gap-y-2">
            {/* Full Name */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register("name", { required: "Full name is required" })}
                  type="text"
                  placeholder="Muhammad"
                  autoFocus
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Age
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 17, message: "Minimum age is 17" },
                    max: { value: 99, message: "Maximum age is 99" },
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="22"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none ${
                    errors.age
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {errors.age && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Select Your City
              </label>
              <select
                {...register("city", { required: "City is required" })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none ${
                  errors.city
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select city</option>
                <option value="Dushanbe">Dushanbe</option>
                <option value="Kulob">Kulob</option>
                <option value="Khujand">Khujand</option>
                <option value="Vahdat">Vahdat</option>
                <option value="Kurgantupe">Kurgantupe</option>
                <option value="Hisor">Hisor</option>
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{9,15}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                  type="tel"
                  placeholder="+992901234567"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Add Image (optional)
              </label>
              <input
                {...register("avatar")}
                type="text"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 4, message: "Min 4 characters" },
                    maxLength: { value: 10, message: "Max 10 characters" },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Maga2211"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg self-center col-span-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-600">
            <button
              onClick={() => router.push("/")}
              className="font-medium text-emerald-600 hover:text-emerald-800 transition-colors outline-none"
            >
              Go Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => router.push("/Login")}
              className="font-medium text-emerald-600 hover:text-emerald-800 transition-colors outline-none"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
);
}
