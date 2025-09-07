import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/" }),
  endpoints: (builder) => ({
    getApartments: builder.query({
      query: () => "apartments",
    }),
    getUsers: builder.query({
      query: () => "users",
    }),
    postUser: builder.mutation({
      query: (form) => ({
        url: "users",
        method: "POST",
        body: form,
      }),
    }),
    postApartment: builder.mutation({
      query: (form) => ({
        url: "apartments",
        method: "POST",
        body: form,
      }),
    }),
    getApartmentById: builder.query({
      query: (id) => `apartments?id=${id}`,
    }),
    getUserById: builder.query({
      query: (id) => `users?id=${id}`,
    }),
    editUserById: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    editFavorites: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getChatsByApartmentAndUser: builder.query({
      query: ({ userId, apartmentId }) =>
        `chats?userId=${userId}&apartmentId=${apartmentId}`,
    }),
    postMessageById: builder.mutation({
      query: ({ chatId, data }) => ({
        url: `chats/${chatId}`,
        method: "PUT",
        body: data,
      }),
    }),
    createChat: builder.mutation({
      query: (newChat) => ({
        url: "chats",
        method: "POST",
        body: newChat,
      }),
    }),
    addToFriend: builder.mutation({
      query: ({ id, friendId }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: friendId,
      }),
    }),
    getUserByIds: builder.query({
      query: (ids) => `users?${ids.map((id) => `id=${id}`).join("&")}`,
    }),
    getUsersBySearch: builder.query({
      query: (search) => `users?name=${search}`,
    }),
    getApartmentByIds: builder.query({
      query: (ids) => `apartments?${ids.map((id) => `id=${id}`).join("&")}`,
    }),
    getUsersChat: builder.query({
      query: () => "privateChats",
      transformResponse: (response, meta, arg) => {
        return response.filter(
          (chat) =>
            chat.participants.includes(arg?.userId1) &&
            chat.participants.includes(arg?.userId2)
        );
      },
    }),
    postMessageByUsers: builder.mutation({
      query: ({ chatId, message }) => ({
        url: `privateChats/${chatId}`,
        method: "PUT",
        body: message,
      }),
    }),
    createChatUsers: builder.mutation({
      query: (newChat) => ({
        url: "privateChats",
        method: "POST",
        body: newChat,
      }),
    }),
   getAllUserChats: builder.query({
  query: () => `privateChats`,
  transformResponse: (response, meta, arg) => {
    return response.filter((chat) => chat.participants.includes(arg));
  },
}),

  }),
});

export const {
  useGetApartmentsQuery,
  useGetUsersQuery,
  usePostUserMutation,
  usePostApartmentMutation,
  useGetApartmentByIdQuery,
  useGetUserByIdQuery,
  useEditUserByIdMutation,
  useEditFavoritesMutation,
  useGetChatsByApartmentAndUserQuery,
  usePostMessageByIdMutation,
  useCreateChatMutation,
  useAddToFriendMutation,
  useGetUserByIdsQuery,
  useGetApartmentByIdsQuery,
  useGetUsersBySearchQuery,
  useGetUsersChatQuery,
  usePostMessageByUsersMutation,
  useCreateChatUsersMutation,
  useGetAllUserChatsQuery,
} = api;
