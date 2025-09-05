"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  User,
  MapPin,
  Home,
  Search,
  UserPlus,
  MoreHorizontal,
  Phone,
  MessageSquare,
} from "lucide-react";
import {
  useGetUserByIdQuery,
  useGetUserByIdsQuery,
  useGetUsersBySearchQuery,
} from "@/features/api";
import Image from "next/image";
import PostTime from "../components/PostTime";
import AddFriendButton from "../components/AddFriend";

export default function ViewFriends() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { data: userById } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const userInfo = Array.isArray(userById) ? userById[0] : userById;
  const [inpSearch, setInpSearch] = useState("");

  // запрос только если есть хотя бы 2 символа
  const { data: searchResult, isFetching: isSearching } =
    useGetUsersBySearchQuery(inpSearch, {
      skip: inpSearch.trim().length < 2,
    });

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
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-600 hover:text-emerald-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inpSearch}
                onChange={(e) => setInpSearch(e.target.value)}
                placeholder="Search friends..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Add Friend
            </button>
          </div>
        </div>

        {/* показываем только если введено 2+ символа */}
        {inpSearch.trim().length >= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {searchResult?.map((friend) => (
              <div
                key={friend.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="h-24 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                  <div className="absolute -bottom-12 left-6">
                    <Image
                      src={friend.avatar ?? "/no-picture.webp"}
                      alt={friend.name}
                      width={80}
                      height={80}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  </div>
                </div>

                <div className="pt-14 px-6 pb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {friend.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {friend.age} years old • {friend.city}
                  </p>

                  <div className="space-y-3 text-slate-700 text-sm mb-6 mt-4">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-emerald-600 mr-3" />
                      <span>{friend.contacts || "No contact provided"}</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="h-4 w-4 text-emerald-600 mr-3" />
                      <span>
                        {friend.apartments?.length || 0}{" "}
                        {friend.apartments?.length === 1
                          ? "apartment"
                          : "apartments"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => router.push(`/userDetail/${friend.id}`)}
                      className="bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Profile
                    </button>
                    <AddFriendButton
                      currentUserId={user?.id}
                      targetUserId={friend.id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* блок друзей */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">My Friends</h2>
              <p className="text-slate-500 mt-2">
                {friends?.length || 0}{" "}
                {friends?.length === 1 ? "friend" : "friends"} in your network
              </p>
            </div>
          </div>

          {friends?.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No friends yet
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Start building your network by adding friends to see their
                apartments and connect.
              </p>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Your First Friend
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends?.map((friend) => {
                if (friend.id !== user?.id)
                  return (
                    <div
                      key={friend.id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className="relative">
                        <div className="h-24 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                        <div className="absolute -bottom-12 left-6">
                          <div className="relative">
                            <Image
                              src={friend.avatar ?? "/no-picture.webp"}
                              alt={friend.name}
                              width={80}
                              height={80}
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white"></div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-14 px-6 pb-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                              {friend.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {friend.age} years old • {friend.city}
                            </p>
                          </div>
                          <button className="text-slate-400 hover:text-emerald-500 p-2 rounded-full hover:bg-slate-100 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="space-y-3 text-slate-700 text-sm mb-6">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-emerald-600 mr-3" />
                            <span>
                              {friend.contacts || "No contact provided"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Home className="h-4 w-4 text-emerald-600 mr-3" />
                            <span>
                              {friend.apartments?.length || 0}
                              {friend.apartments?.length === 1
                                ? " apartment"
                                : " apartments"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-emerald-600 mr-3" />
                            <span>{friend.district || "Unknown district"}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <p className="text-xs text-slate-400">
                            Joined <PostTime createAt={friend.createAt} />
                          </p>
                          <div className="flex space-x-2">
                            <button className="text-slate-600 hover:text-emerald-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
                              <MessageSquare className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/userDetail/${friend.id}`)
                              }
                              className="bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
