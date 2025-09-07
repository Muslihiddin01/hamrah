"use client";
import { useGetUsersChatQuery } from "@/features/api";
import { BellRing, NotebookIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Notifications() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      setUser(parsed);
    }
  },[]);

  const { data: chats } = useGetUsersChatQuery();
  return (
    <div>
      <BellRing size={20} />
    </div>
  );
}
