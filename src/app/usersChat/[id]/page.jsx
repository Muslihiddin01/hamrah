"use client";
import {
  useCreateChatUsersMutation,
  useGetUsersChatQuery,
  usePostMessageByUsersMutation,
} from "@/features/api";
import { ArrowLeft, Send, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function UsersChat() {
  const router = useRouter();
  const { id } = useParams();
  const currentUser = localStorage.getItem("user");
  const user = JSON.parse(currentUser);
  const { data: twoPeopleChat, refetch: chatsRefetch } = useGetUsersChatQuery(
    { userId1: user?.id, userId2: id },
    {
      skip: !user?.id && !id,
    }
  );
  const [message, setMessage] = useState("");

  const [postMessage] = usePostMessageByUsersMutation();

  const chats = Array.isArray(twoPeopleChat) ? twoPeopleChat[0] : twoPeopleChat;

  const [createChat] = useCreateChatUsersMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      async function createNewChat() {
        const existingChat = twoPeopleChat?.find(
          (c) =>
            c.participants.includes(user?.id) && c.participants.includes(id)
        );
        if (existingChat) {
          console.log("found chat 😊");
        } else {
          const newChat = {
            id: Date.now().toString(),
            userId1: user?.id,
            userId2: id,
            chat: [],
          };
          try {
            await createChat(newChat);
            console.log("Chat created");
            chatsRefetch();
          } catch (error) {
            console.error(error);
          }
        }
      }
      if (user?.id && id) createNewChat();
    }, 1500);
    return () => clearTimeout(timer);
  }, [twoPeopleChat, id, user?.id, createChat]);

  async function postNewMessage(e) {
    e.preventDefault();
    const newMessage = {
      ...chats,
      chat: [
        ...chats.chat,
        { id: Date.now().toString(), message: message, senderId: user?.id },
      ],
    };
    try {
      await postMessage({ chatId: chats?.id, message: newMessage });
      chatsRefetch();
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  }

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (chats?.chat?.length) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats?.chat]);

  if (user?.id === id) router.push("/users");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col py-6 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors mb-6 font-['Open_Sans']"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Chat List */}
            <div className="lg:col-span-1 border-r border-gray-200 p-4 bg-gray-50 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 font-['Inter'] mb-4">
                Messages
              </h2>
              <div className="space-y-2 overflow-y-auto flex-1">
                {chats ? (
                  <div className="p-4 border rounded-xl hover:bg-gray-100 cursor-pointer bg-white shadow-sm transition-all">
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
                ) : (
                  <p className="text-gray-400 font-['Open_Sans'] mt-2">
                    No chats yet.
                  </p>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-2 flex flex-col bg-gray-50">
              {!chats && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 ">
                  <User className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-['Open_Sans']">
                    Select a conversation to start messaging
                  </p>
                  <div className="mt-4 text-gray-400 font-['Open_Sans']">
                    Chat ID: {id}
                  </div>
                </div>
              )}

              {chats && (
                <>
                  {/* Контейнер сообщений (скроллится только он) */}
                  <main className="flex-1 overflow-y-auto p-5 flex flex-col space-y-2 bg-gradient-to-b from-gray-50 to-gray-100">
                    {chats?.chat?.map((message, i) => {
                      const prevMessage = chats.chat[i - 1];
                      const currentTime = new Date(Number(message.id));
                      const prevTime = prevMessage
                        ? new Date(Number(prevMessage.id))
                        : null;

                      const showTime =
                        !prevTime ||
                        currentTime.getTime() - prevTime.getTime() >
                          30 * 60 * 1000;

                      return (
                        <div
                          key={message?.id ?? i}
                          className="flex flex-col items-center"
                        >
                          {showTime && (
                            <span className="text-xs text-gray-500 mb-2">
                              {currentTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}

                          <article
                            className={`max-w-[70%] break-words px-5 py-2 rounded-2xl transition-all shadow-md ${
                              message.senderId === user?.id
                                ? "self-end bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                                : "self-start bg-gray-300 text-gray-900"
                            }`}
                          >
                            <p>{message?.message}</p>
                          </article>
                        </div>
                      );
                    })}
                    <div ref={messageEndRef} />
                  </main>

                  {/* Форма закреплена снизу */}
                  <form
                    onSubmit={postNewMessage}
                    className="p-4 border-t border-gray-300 bg-white flex items-center space-x-2"
                  >
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring focus:ring-emerald-500 focus:border-emerald-500 transition-all font-['Open_Sans'] outline-none"
                    />
                    <button
                      type="submit"
                      className={`text-white p-3 rounded-2xl transition-all ${
                        message.trim()
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
