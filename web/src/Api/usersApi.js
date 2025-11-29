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
        registerUser: builder.mutation({
            query: (data) => ({
                url: "/users/register/",
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
        getReadedLessonsByCourse: builder.query({
            query: (courseId) => ({
                url: `/users/check-my-lessons/${courseId}/`,
                method: "GET",
            }),
            providesTags: ["user"],
        }),
        setLessonAsReaded: builder.mutation({
            query: (lessonId) => ({
                url: `/users/check-lesson/${lessonId}/`,
                method: "POST",
            }),
            invalidatesTags: ["user"],
        }),
        getMyCourseProgress: builder.query({
            query: (courseId) => ({
                url: `/users/my-progress/${courseId}/`,
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
    useRegisterUserMutation,
    useGetUsersByRoleNameQuery,
    useGetReadedLessonsByCourseQuery,
    useSetLessonAsReadedMutation,
    useGetMyCourseProgressQuery,
} = usersApi;