import CONFIG from "../Core/сonfig.js";
import {baseQueryWithAuth} from "./baseQuery.js";
import {createApi} from "@reduxjs/toolkit/query/react";


export const coursesApi = createApi({
    reducerPath: 'coursesApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getAllCourses: builder.query({
            query: () => ({
                url: "/courses/",
                method: "GET",
            }),
            providesTags: ['course'],
        }),
        createCourse: builder.mutation({
            query: (data) => ({
                url: "/courses/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['course'],
        }),
        updateCourse: builder.mutation({
            query: ({courseId, ...data}) => ({
                url: `/courses/${courseId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['course'],
        }),
        getCourseTeachers: builder.query({
            query: (courseId) => ({
                url: `/courses/${courseId}/teachers/`,
                method: "GET",
            }),
            providesTags: ['teacher'],
        }),
        replaceCourseTeachers: builder.mutation({
            query: ({courseId, teachers}) => ({
                url: `/courses/${courseId}/teachers/`,
                method: "PUT",
                body: teachers,
            }),
            invalidatesTags: ['teacher'],
        }),
        getCourseStudents: builder.query({
            query: (courseId) => ({
                url: `/courses/${courseId}/students/`,
                method: "GET",
            }),
            providesTags: ['student'],
        }),
        replaceCourseStudents: builder.mutation({
            query: ({courseId, students}) => ({
                url: `/courses/${courseId}/students/`,
                method: "PUT",
                body: students,
            }),
            invalidatesTags: ['student'],
        }),
    }),
});

export const {
    useGetAllCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useGetCourseTeachersQuery,
    useReplaceCourseTeachersMutation,
    useGetCourseStudentsQuery,
    useReplaceCourseStudentsMutation,
} = coursesApi;