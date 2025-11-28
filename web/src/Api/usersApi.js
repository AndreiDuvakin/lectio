import {baseQueryWithAuth} from "./baseQuery.js";
import {createApi} from "@reduxjs/toolkit/query/react";


export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["user"],
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => "/users/",
            providesTags: ["user"],
        }),
        getAuthenticatedUserData: builder.query({
            query: () => "/users/me/",
            providesTags: ["user"],
        }),
        updateUser: builder.mutation({
            query: ({userId, ...data}) => ({
                url: `/users/${userId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),
        updateUserPassword: builder.mutation({
            query: ({userId, ...data}) => ({
                url: `/users/change-password/${userId}/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),
        createUser: builder.mutation({
            query: (data) => ({
                url: "/users/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),
        getUsersByRoleName: builder.query({
            query: (roleName) => ({
                url: `/users/role/${roleName}/`,
                method: "GET",
            }),
            providesTags: ["user"],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetAuthenticatedUserDataQuery,
    useUpdateUserMutation,
    useUpdateUserPasswordMutation,
    useCreateUserMutation,
    useGetUsersByRoleNameQuery,
} = usersApi;