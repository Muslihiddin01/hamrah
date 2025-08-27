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
  }),
});

export const {
  useGetApartmentsQuery,
  useGetUsersQuery,
  usePostUserMutation,
  usePostApartmentMutation,
} = api;
