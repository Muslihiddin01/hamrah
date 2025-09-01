"use client";
import { useEditFavoritesMutation, useGetUserByIdQuery } from "@/features/api";
import React from "react";

const AddFavorite = ({ userId, apartmentId }) => {
  const { data: userById, refetch: userIdRefetch } = useGetUserByIdQuery(userId, { skip: !userId });
  const [editFavorites] = useEditFavoritesMutation();

  const user = React.useMemo(() => {
    if (!userById) return null;
    return Array.isArray(userById) ? userById[0] : userById;
  }, [userById]);

  const isLiked = React.useMemo(() => {
    return user?.favorites?.includes(apartmentId);
  }, [user, apartmentId]);

  const handleLike = React.useCallback(
    async (e) => {
      e.stopPropagation();
      if (!userId || !user) alert("Please sign up");

      try {
        const currentFavorites = Array.isArray(user.favorites) ? user.favorites : [];

        if (currentFavorites.includes(apartmentId)) {
          // удалить из favorites
          await editFavorites({
            id: userId,
            data: {
              ...user,
              favorites: currentFavorites.filter((fav) => fav !== apartmentId),
            },
          });
          userIdRefetch()
        } else {
          // добавить в favorites
          await editFavorites({
            id: userId,
            data: {
              ...user,
              favorites: [...currentFavorites, apartmentId],
            },
          });
          userIdRefetch()
        }
      } catch (error) {
        console.error("Ошибка при редактировании избранного:", error);
      }
    },
    [editFavorites, userId, user, apartmentId]
  );

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleLike}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isLiked ? "red" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-heart text-red-600 hover:text-red-400"
      >
        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
      </svg>
    </div>
  );
};

export default React.memo(AddFavorite);
