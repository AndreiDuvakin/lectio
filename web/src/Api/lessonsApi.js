import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuth} from "./baseQuery.js";


export const lessonsApi = createApi({
    reducerPath: "lessonsApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["lesson"],
    endpoints: (builder) => ({
        getLessonsByCourseId: builder.query({
            query: (courseId) => ({
                url: `/lessons/course/${courseId}/`,
                method: "GET",
            }),
            providesTags: ["lesson"],
        }),
        getLessonById: builder.query({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/`,
                method: "GET",
            }),
            providesTags: ["lesson"],
        }),
        createLesson: builder.mutation({
            query: ({courseId, lessonData}) => ({
                url: `/lessons/${courseId}/`,
                method: "POST",
                body: lessonData,
            }),
            invalidatesTags: ["lesson"],
        }),
        updateLesson: builder.mutation({
            query: ({lessonId, lessonData}) => ({
                url: `/lessons/${lessonId}/`,
                method: "PUT",
                body: lessonData,
            }),
            invalidatesTags: ["lesson"],
        }),
        deleteLesson: builder.mutation({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["lesson"],
        }),
        getLessonFilesList: builder.query({
            query: (lessonId) => ({
                url: `/lessons/files/${lessonId}/`,
                method: "GET",
            }),
            providesTags: ["lesson"],
        }),
        getDownloadFile: builder.query({
            query: (fileId) => ({
                url: `/lessons/file/${fileId}/`,
                method: "GET",
            }),
            providesTags: ["lesson"],
        }),
        uploadFile: builder.mutation({
            query: ({lesson_id, fileData}) => {
                if (!(fileData instanceof File)) {
                    throw new Error('Invalid file object');
                }
                const formData = new FormData();
                formData.append('file', fileData);
                return {
                    url: `/lessons/files/${lesson_id}/upload/`,
                    method: 'POST',
                    formData: true,
                    body: formData,
                };
            },
            invalidatesTags: ["lesson"],
        }),
        deleteFile: builder.mutation({
            query: (fileId) => ({
                url: `/lessons/files/${fileId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["lesson"],
        }),
    }),
});

export const {
    useGetLessonsByCourseIdQuery,
    useGetLessonByIdQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useGetLessonFilesListQuery,
    useGetDownloadFileQuery,
    useUploadFileMutation,
    useDeleteFileMutation,
} = lessonsApi;
