import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuth} from "./baseQuery.js";


export const tasksApi = createApi({
    reducerPath: "tasksApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["task"],
    endpoints: (builder) => ({
        getTasksByCourseId: builder.query({
            query: (courseId) => ({
                url: `/tasks/course/${courseId}/`,
                method: "GET",
            }),
            providesTags: ["task"],
            transformResponse: (response) => {
                return response.map(task => ({
                    ...task,
                    contentType: "task",
                    __typename: "Task"
                }));
            },
        }),
        getTaskById: builder.query({
            query: (taskId) => ({
                url: `/tasks/${taskId}/`,
                method: "GET",
            }),
            providesTags: ["task"],
        }),
        createTask: builder.mutation({
            query: ({courseId, taskData}) => ({
                url: `/tasks/${courseId}/`,
                method: "POST",
                body: taskData,
            }),
            invalidatesTags: ["task"],
        }),
        updateTask: builder.mutation({
            query: ({taskId, taskData}) => ({
                url: `/tasks/${taskId}/`,
                method: "PUT",
                body: taskData,
            }),
            invalidatesTags: ["task"],
        }),
        deleteTask: builder.mutation({
            query: (taskId) => ({
                url: `/tasks/${taskId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["task"],
        }),
        getTaskFilesList: builder.query({
            query: (taskId) => ({
                url: `/tasks/files/${taskId}/`,
                method: "GET",
            }),
            providesTags: ["task"],
        }),
        getDownloadFile: builder.query({
            query: (fileId) => ({
                url: `/tasks/file/${fileId}/`,
                method: "GET",
            }),
            providesTags: ["task"],
        }),
        uploadFile: builder.mutation({
            query: ({task_id, fileData}) => {
                if (!(fileData instanceof File)) {
                    throw new Error('Invalid file object');
                }
                const formData = new FormData();
                formData.append('file', fileData);
                return {
                    url: `/tasks/files/${task_id}/upload/`,
                    method: 'POST',
                    formData: true,
                    body: formData,
                };
            },
            invalidatesTags: ["task"],
        }),
        deleteFile: builder.mutation({
            query: (fileId) => ({
                url: `/tasks/files/${fileId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["task"],
        }),
    }),
});

export const {
    useGetTasksByCourseIdQuery,
    useGetTaskByIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useGetTaskFilesListQuery,
    useGetDownloadFileQuery,
    useUploadFileMutation,
    useDeleteFileMutation,
} = tasksApi;
