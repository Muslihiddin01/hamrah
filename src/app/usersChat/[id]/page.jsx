"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCreateChatUsersMutation, useGetUsersChatQuery, usePostMessageByUsersMutation } from "@/features/api";
import AllUserChats from "../../components/AllUserChats";
import ChatWindow from "../../components/ChatWindow";
import { ArrowLeft } from "lucide-react";

export default function UsersChat() {
  const router = useRouter();
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const { data: twoPeopleChat, refetch } = useGetUsersChatQuery(
    { userId1: currentUser?.id, userId2: id },
    { skip: !currentUser?.id || !id }
  );

  const [createChat] = useCreateChatUsersMutation();
  const [postMessage] = usePostMessageByUsersMutation();
  const chats = Array.isArray(twoPeopleChat) ? twoPeopleChat[0] : twoPeopleChat;

  const [activeChat, setActiveChat] = useState(chats);
  const [message, setMessage] = useState("");

  useEffect(() => { if (currentUser?.id === id) router.push("/users"); }, [id, currentUser?.id, router]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const existingChat = twoPeopleChat?.find(c => c.participants.includes(currentUser?.id) && c.participants.includes(id));
      if (!existingChat && currentUser?.id && id) {
        const newChat = { id: Date.now().toString(), userId1: currentUser.id, userId2: id, chat: [] };
        try { await createChat(newChat); refetch(); } catch (e) { console.error(e); }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [twoPeopleChat, id, currentUser?.id, createChat, refetch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col py-6 px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="flex items-center text-gray-700 hover:text-emerald-600 mb-6 font-semibold">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>

        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
          <AllUserChats currentUserId={currentUser?.id} onSelectChat={setActiveChat} />
          <ChatWindow
            chat={activeChat}
            currentUserId={currentUser?.id}
            postMessageFn={postMessage}
            messageValue={message}
            setMessageFn={setMessage}
          />
        </div>
      </main>
    </div>
  );
}
