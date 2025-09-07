"use client";
import ChatPreview from "./ChatPreview";
import { useGetAllUserChatsQuery } from "@/features/api";
import { useState } from "react";

export default function AllUserChats({ currentUserId, onSelectChat }) {
  const { data: userChats } = useGetAllUserChatsQuery(currentUserId, { skip: !currentUserId });
  const [activeChatId, setActiveChatId] = useState(null);

  const handleSelectChat = (chat) => {
    setActiveChatId(chat.id);
    onSelectChat(chat);
  };

  return (
    <aside className="border-r border-gray-200 w-full lg:w-[30%] overflow-y-auto bg-white shadow-sm">
      {userChats?.map((chat) => (
        <ChatPreview
          key={chat.id}
          chat={chat}
          currentUserId={currentUserId}
          isActive={chat.id === activeChatId}
          onClick={() => handleSelectChat(chat)}
        />
      ))}
    </aside>
  );
}
