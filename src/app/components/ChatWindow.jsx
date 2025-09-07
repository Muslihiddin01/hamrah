"use client";
import { useRef, useEffect } from "react";
import { Send, User } from "lucide-react";

export default function ChatWindow({ chat, currentUserId, postMessageFn, messageValue, setMessageFn }) {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageValue.trim()) return;

    const newMessage = {
      ...chat,
      chat: [...chat.chat, { id: Date.now().toString(), message: messageValue, senderId: currentUserId }],
    };

    try {
      await postMessageFn({ chatId: chat.id, message: newMessage });
      setMessageFn("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-600">
        <User className="h-16 w-16 mb-4 text-gray-400" />
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center font-semibold shadow-sm">
        {chat.participants.filter(p => p !== currentUserId).join(", ")}
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
        {chat.chat?.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-[70%] break-words shadow
              ${msg.senderId === currentUserId ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-900"}
            `}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </main>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-300 bg-white flex items-center space-x-2">
        <input
          value={messageValue}
          onChange={(e) => setMessageFn(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" className={`p-3 rounded-full ${messageValue.trim() ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-400 cursor-not-allowed text-gray-100"}`}>
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
