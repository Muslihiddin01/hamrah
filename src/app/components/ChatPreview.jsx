"use client";
import { useGetUserByIdQuery } from "@/features/api";

export default function ChatPreview({ chat, currentUserId, isActive, onClick }) {
  const otherUserId = chat.participants.find((p) => p !== currentUserId);
  const { data: otherUserById } = useGetUserByIdQuery(otherUserId, { skip: !otherUserId });
  const otherUser = Array.isArray(otherUserById) ? otherUserById[0] : otherUserById;

  return (
    <article
      onClick={onClick}
      className={`flex items-center gap-3 p-3 border-b cursor-pointer transition-colors duration-200
        ${isActive ? "bg-emerald-100 shadow-inner" : "hover:bg-gray-50"}
      `}
    >
      <img
        src={otherUser?.avatar || "/default-avatar.png"}
        alt={otherUser?.name || "User"}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex flex-col overflow-hidden">
        <span className="font-medium truncate">{otherUser?.name || "Loading..."}</span>
        <span className="text-sm text-gray-500 truncate">
          {chat.chat?.[chat.chat.length - 1]?.message || "Нет сообщений"}
        </span>
      </div>
    </article>
  );
}
