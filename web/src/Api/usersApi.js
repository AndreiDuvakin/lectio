import {baseQueryWithAuth} from "./baseQuery.js";
import {createApi} from "@reduxjs/toolkit/query/react";


export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["user"],
    endpoints: (builder) => ({
        getAuthenticatedUserData: builder.query({
            query: () => "/users/me/",
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
    }),
});

export const {
    useGetAuthenticatedUserDataQuery,
    useUpdateUserMutation,
    useUpdateUserPasswordMutation,
} = usersApi;