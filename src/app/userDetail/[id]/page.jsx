"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import { Star, Users, ArrowLeft } from "lucide-react";
import {
  useAddToFriendMutation,
  useGetUserByIdQuery,
} from "@/features/api";
import Link from "next/link";
import Image from "next/image";
import AddFriendButton from "@/app/components/AddFriend";

const UserDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: user } = useGetUserByIdQuery(id, { skip: !id });
  const userDetail = Array.isArray(user) ? user[0] : user;
  const [currentUser, setCurrentUser] = useState(null);
  const [addFriend] = useAddToFriendMutation();

  const userStorage = JSON.parse(localStorage.getItem("user"));

  const userId = JSON.parse(localStorage.getItem("user")).id;
  console.log(userStorage);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  async function addToFriend() {
    if (userId === id || !userId) return;
    const friendId = {
      ...userStorage,
      friends: [...userStorage.friends, id],
    };
    try {
      await addFriend({ id: userId, friendId: friendId });
      alert("Success");
    } catch (error) {
      console.error(error);
    }
  }

  if (!userDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={currentUser}
        onLogout={() => localStorage.removeItem("user")}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors mb-6 font-['Open_Sans']"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {/* User Card */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Avatar */}
            <div className="flex justify-center items-center bg-gradient-to-r from-emerald-50 to-sky-50 p-8">
              <Image
                width={100}
                height={100}
                src={userDetail?.avatar ?? "image"}
                alt={userDetail?.name ?? "image"}
                className="rounded-full object-contain w-40 h-40 border-4 border-black shadow"
              />
            </div>

            {/* User Info */}
            <div className="md:col-span-2 p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-['Inter'] mb-2">
                  {userDetail.name}, {userDetail.age}
                </h1>
                <p className="text-gray-600 text-lg mb-4 font-['Open_Sans']">
                  {userDetail.city}, {userDetail.district}
                </p>
                <p className="text-gray-600 mb-2 font-['Open_Sans']">
                  <span className="font-medium">Address:</span>{" "}
                  {userDetail.address}
                </p>
                <p className="text-gray-600 mb-2 font-['Open_Sans']">
                  <span className="font-medium">Contacts:</span>{" "}
                  {userDetail.contacts}
                </p>
                <p className="text-gray-500 text-sm mb-2 font-['Open_Sans']">
                  Joined:{" "}
                  {new Date(userDetail.createAt).toLocaleDateString("en-GB")}
                </p>
                <p className="text-gray-600 mb-2 font-['Open_Sans']">
                  <span className="font-medium">Favorites:</span>{" "}
                  {userDetail.favorites?.length || 0}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <Button size="md" variant="primary">
                  Написать
                </Button>
                <Link href={`/userPosts/${id}`}>
                  <Button size="md" variant="outline">
                    View Apartments
                  </Button>
                </Link>
                <AddFriendButton currentUserId={currentUser?.id} targetUserId={id} />
              </div>
            </div>
          </div>
        </div>

        {/* Extra Info */}
        <section className="mt-12 text-center text-gray-500 font-['Open_Sans']">
          <p>This is where additional user info or activity could go.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserDetail;
