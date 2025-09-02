"use client";
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { useAddToFriendMutation } from "@/features/api";

const AddFriendButton = ({ currentUserId, targetUserId }) => {
  const [addFriend] = useAddToFriendMutation();
  const [isFriend, setIsFriend] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setLocalUser(parsed);

      // Проверяем есть ли targetUserId в друзьях
      setIsFriend(parsed.friends?.includes(targetUserId));
    }
  }, [targetUserId]);

  const handleClick = async () => {
    if (!localUser || currentUserId === targetUserId) return;

    let updatedUser;
    if (isFriend) {
      // Удаляем из друзей
      updatedUser = {
        ...localUser,
        friends: localUser.friends.filter((f) => f !== targetUserId),
      };
    } else {
      // Добавляем в друзья
      updatedUser = {
        ...localUser,
        friends: [...(localUser.friends || []), targetUserId],
      };
    }

    try {
      await addFriend({ id: currentUserId, friendId: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLocalUser(updatedUser);
      setIsFriend(!isFriend);
    } catch (error) {
      console.error("Ошибка при изменении списка друзей:", error);
    }
  };

  return (
    <Button variant={isFriend ? "outline" : "primary"} size="md" onClick={handleClick}>
      {isFriend ? "Убрать из друзей" : "Добавить в друзья"}
    </Button>
  );
};

export default AddFriendButton;
