"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, User } from "lucide-react";
import { useGetUsersQuery } from "@/features/api";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: users } = useGetUsersQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      users.forEach((user) => {
        if (
          user.name === data.name.trim() &&
          user.password === data.password.trim()
        ) {
          console.log(users, "Data", data);
          toast.success("Login successful!");
          localStorage.setItem("user", JSON.stringify(user));
          router.push("/"); // navigate to home
        }
      });
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className=" bg-gray-50">
      <main className="py-12 min-h-screen content-center">
        <div className="md:max-w-[40%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 font-['Inter']">
                Welcome Back
              </h1>
              <p className="text-slate-600 mt-2 font-['Open_Sans']">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']"
                >
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("name")}
                    id="name"
                    autoFocus
                    type="text"
                    placeholder="Muhammad"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-['Open_Sans'] ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 font-['Open_Sans']">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-2 font-['Inter']"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-['Open_Sans'] ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 font-['Open_Sans']">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors font-medium font-['Inter'] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 font-['Open_Sans']">
                Don't have an account?{" "}
                <Link
                  href="/Register"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
