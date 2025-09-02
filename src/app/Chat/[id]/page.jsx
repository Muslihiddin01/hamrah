"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Send, User } from "lucide-react";
import {
  useGetChatsByApartmentAndUserQuery,
  usePostMessageByIdMutation,
} from "@/features/api";

const Chat = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("userId");

  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const { data: getChatsByApartmentAndUser, refetch: chatsRefetch } =
    useGetChatsByApartmentAndUserQuery(
      { userId: ownerId, apartmentId: id },
      { skip: !ownerId && !id }
    );

  const chats = Array.isArray(getChatsByApartmentAndUser)
    ? getChatsByApartmentAndUser[0]
    : getChatsByApartmentAndUser;

  const [editAndPostMessage] = usePostMessageByIdMutation();

  const [message, setMessage] = useState("");

  async function addMessage(e) {
    e.preventDefault();
    const data = {
      ...chats,
      chat: [
        ...chats.chat,
        { id: Date.now().toString(), message: message, senderId: user?.id },
      ],
    };
    try {
      await editAndPostMessage({
        userId: ownerId,
        apartmentId: id,
        data: data,
      });
      setMessage("");
      chatsRefetch();
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors mb-6 font-['Open_Sans']"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
              {/* Chat List */}
              <div className="lg:col-span-1 border-r border-gray-200 p-4 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 font-['Inter'] mb-4">
                  Messages
                </h2>
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg hover:bg-gray-100 cursor-pointer bg-white">
                    <p className="font-medium text-gray-900 font-['Inter'] truncate">
                      Apartment Title
                    </p>
                    <p className="text-sm text-gray-600 font-['Open_Sans']">
                      with User Name
                    </p>
                    <p className="text-sm text-gray-500 truncate font-['Open_Sans']">
                      Last message preview...
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-100 cursor-pointer bg-white">
                    <p className="font-medium text-gray-900 font-['Inter'] truncate">
                      Apartment Title 2
                    </p>
                    <p className="text-sm text-gray-600 font-['Open_Sans']">
                      with User Name
                    </p>
                    <p className="text-sm text-gray-500 truncate font-['Open_Sans']">
                      Last message preview...
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="lg:col-span-2 flex flex-col justify-between bg-gray-50 ">
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-['Open_Sans']">
                    Select a conversation to start messaging
                  </p>
                  <div className="mt-4 text-gray-400 font-['Open_Sans']">
                    Chat ID: {id}
                  </div>
                </div>

                <main className="w-full border p-5 flex flex-col">
                  {chats?.chat?.map((message, i) => {
                    return (
                      <article
                        key={message?.id ?? i}
                        className={`${
                          message?.senderId === user?.id
                            ? "self-end bg-emerald-600 text-white"
                            : "self-start bg-gray-300"
                        } py-2.5 px-5 rounded-full`}
                      >
                        {message?.message}
                      </article>
                    );
                  })}
                </main>

                {/* Message Input */}
                <form
                  onSubmit={addMessage}
                  className="p-4 border-t border-gray-300 bg-white flex items-center space-x-2"
                >
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-['Open_Sans'] outline-none"
                  />
                  <button
                    type="submit"
                    className={` text-white p-2 rounded-lg hover:bg-emerald-700 ${
                      message ? "bg-emerald-600" : "bg-emerald-900"
                    } transition-colors`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;
