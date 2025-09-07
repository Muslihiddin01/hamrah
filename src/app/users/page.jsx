"use client";
import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "@/features/api";
import Image from "next/image";
import Button from "../components/Button"; // Твоя кнопка
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

const UsersPage = () => {
  const { data: users } = useGetUsersQuery();
  const [filterCity, setFilterCity] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    let filtered = users || [];
    if (filterCity)
      filtered = filtered.filter((u) =>
        u.city.toLowerCase().includes(filterCity.toLowerCase())
      );
    if (searchName)
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(searchName.toLowerCase())
      );
    setFilteredUsers(filtered);
  }, [users, filterCity, searchName]);

  return (
    <div className="bg-gray-50 ">
      <Header user={user} onLogout={() => localStorage.removeItem("user")} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Community Members
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
          <input
            type="text"
            placeholder="Search by city..."
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-emerald-600 transition-colors delay-75 focus:ring focus:ring-emerald-500 outline-none"
          />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-emerald-600 transition-colors delay-75 focus:ring focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-6 py-3">Avatar</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Apartments</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-gray-300 last:border-none hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Image
                      src={e.avatar}
                      alt={e.name}
                      width={50}
                      height={50}
                      className="rounded-full w-14 h-14"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {e.name}
                  </td>
                  <td className="px-6 py-4">{e.city}</td>
                  <td className="px-6 py-4">
                    {e.apartments?.length > 0
                      ? "Has apartment"
                      : "No apartment"}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <Link href={`/usersChat/${e.id}`}>
                      <Button size="sm" variant="primary">
                        Написать
                      </Button>
                    </Link>
                    <Link href={`/userDetail/${e.id}`}>
                      <Button size="sm" variant="outline">
                        Профиль
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found for your filter.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UsersPage;
