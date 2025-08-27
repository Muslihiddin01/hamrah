"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Send, ArrowLeft, User } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const messagesEndRef = useRef(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const apartmentIdFromQuery = searchParams.get("apartmentId");

  // Mock chat data
  const chats = [
    {
      id: 1,
      apartmentId: 1,
      apartmentTitle: "Modern Shared Apartment",
      participants: ["Anna", "Marco"],
      lastMessage: "The apartment looks great! When can we schedule a visit?",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      apartmentId: 2,
      apartmentTitle: "Cozy Student Flat",
      participants: ["Lisa", "Tom"],
      lastMessage: "Thanks for your interest! Let's discuss the details.",
      timestamp: "1 day ago",
    },
  ];

  const mockMessages = [
    {
      id: 1,
      sender: "Anna",
      message:
        "Hi! I saw you're interested in our apartment. It's a great place!",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      message:
        "Hello! Yes, it looks perfect for what I'm looking for. Could you tell me more about the neighborhood?",
      timestamp: "10:35 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Marco",
      message:
        "The area is really student-friendly with lots of cafes and good transport connections to universities.",
      timestamp: "10:40 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      message: "That sounds great! When would be a good time to visit?",
      timestamp: "10:45 AM",
      isOwn: true,
    },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      toast.error("Please login to access chat");
      router.push("/Login");
      return;
    }

    // If apartmentId is provided via query, select that chat
    if (apartmentIdFromQuery) {
      const chat = chats.find(
        (c) => c.apartmentId === Number(apartmentIdFromQuery)
      );
      if (chat) {
        setSelectedChat(chat);
        setMessages(mockMessages);
      }
    } else if (chats.length > 0) {
      setSelectedChat(chats[0]);
      setMessages(mockMessages);
    }
  }, [router, apartmentIdFromQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: selectedChat?.participants[0] || "Roommate",
        message: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: false,
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMessages(mockMessages);
    router.push(`/chat?apartmentId=${chat.apartmentId}`, { shallow: true });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-slate-600 hover:text-emerald-600 transition-colors mb-6 font-['Open_Sans']"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
              {/* Chat List */}
              <div className="lg:col-span-1 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-slate-900 font-['Inter']">
                    Messages
                  </h2>
                </div>
                <div className="overflow-y-auto h-full">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleChatSelect(chat)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        selectedChat?.id === chat.id
                          ? "bg-emerald-50 border-emerald-200"
                          : ""
                      }`}
                    >
                      <h3 className="font-medium text-slate-900 mb-1 font-['Inter'] truncate">
                        {chat.apartmentTitle}
                      </h3>
                      <p className="text-sm text-slate-600 mb-1 font-['Open_Sans']">
                        with {chat.participants.join(", ")}
                      </p>
                      <p className="text-sm text-slate-500 truncate font-['Open_Sans']">
                        {chat.lastMessage}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-['Open_Sans']">
                        {chat.timestamp}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="lg:col-span-2 flex flex-col">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-slate-900 font-['Inter']">
                        {selectedChat.apartmentTitle}
                      </h3>
                      <p className="text-sm text-slate-600 font-['Open_Sans']">
                        with {selectedChat.participants.join(", ")}
                      </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-100 text-slate-900"
                            }`}
                          >
                            {!message.isOwn && (
                              <p className="text-xs font-medium mb-1 opacity-75">
                                {message.sender}
                              </p>
                            )}
                            <p className="font-['Open_Sans']">
                              {message.message}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                message.isOwn
                                  ? "text-emerald-100"
                                  : "text-slate-500"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <form
                      onSubmit={handleSendMessage}
                      className="p-4 border-t border-gray-200"
                    >
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-['Open_Sans']"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim()}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Send message"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-slate-600 font-['Open_Sans']">
                        Select a conversation to start messaging
                      </p>
                    </div>
                  </div>
                )}
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
