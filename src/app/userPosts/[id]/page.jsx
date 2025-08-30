"use client";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useGetUserByIdQuery } from "@/features/api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserPosts = () => {
  const { id } = useParams();
  const { data: userById } = useGetUserByIdQuery(id, { skip: !id });
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const usersApartments = Array.isArray(userById) ? userById[0] : userById;

  if (!usersApartments) return <p>Загрузка...</p>;

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />

      <section className="min-h-screen max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={usersApartments?.avatar || "/default-avatar.png"}
            alt={usersApartments?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{usersApartments?.name}</h1>
            <p className="text-gray-500">{usersApartments?.city}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          Все объявления автора{" "}
          <span className="font-medium">({userById.length})</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersApartments?.apartments?.map((apartment, i) => (
            <article
              onClick={() => router.push(`/ApartmentDetail/${apartment?.id}`)}
              key={apartment?.id ?? i}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {apartment?.images &&
                apartment?.images
                  .slice(0, 1)
                  .map((image) => (
                    <Image
                      key={image.id}
                      src={image.imageName}
                      width={300}
                      height={300}
                      className="w-full md:h-[300px] h-[230px]"
                      alt="image"
                    />
                  ))}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{apartment?.title}</h3>
                <p className="text-gray-600 mb-2">{apartment?.district}</p>
                <p className="text-emerald-600 font-bold">
                  {apartment?.price} c.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserPosts;
