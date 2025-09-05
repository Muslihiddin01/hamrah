"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, User, MapPin, Home } from "lucide-react";
import { useGetUserByIdQuery, useGetUserByIdsQuery } from "@/features/api";
import Image from "next/image";
import PostTime from "../components/PostTime";

export default function ViewFriends() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { data: userById } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const userInfo = Array.isArray(userById) ? userById[0] : userById;

  const { data: friends } = useGetUserByIdsQuery(userInfo?.friends ?? [], {
    skip: !userInfo?.friends?.length,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 min-h-screen sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-600 hover:text-emerald-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 font-['Inter']">
            My Friends
          </h2>

          {friends?.length === 0 && (
            <p className="text-slate-600 font-['Open_Sans']">
              You don’t have friends yet 😔
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {friends?.map((friend) => (
              <article
                key={friend.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={friend.avatar ?? "/no-picture.webp"}
                    alt={friend.name}
                    width={60}
                    height={60}
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 font-['Inter']">
                      {friend.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-['Open_Sans']">
                      {friend.age} years old
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-slate-700 font-['Open_Sans'] text-sm">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    Contacts: {friend.contacts || "—"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-emerald-600" />
                    Apartments: {friend.apartments?.length ?? 0}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    {friend.city}, {friend.district || "—"}
                  </p>
                  <p className="text-xs text-slate-400">
                    Joined: <PostTime createAt={friend.createAt} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
