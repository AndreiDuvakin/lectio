import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuth} from "./baseQuery.js";


export const solutionsApi = createApi({
    reducerPath: "solutionsApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["solution"],
    endpoints: (builder) => ({
        getTaskSolutions: builder.query({
            query: (taskId) => ({
                url: `/solutions/task/${taskId}/`,
                method: "GET"
            }),
            providesTags: ["solution"],
        }),
        getTaskStudentSolutions: builder.query({
            query: ({taskId, studentId}) => ({
                url: `/solutions/task/${taskId}/student/${studentId}/`,
                method: "GET"
            }),
            providesTags: ["solution"],
        }),
        createSolution: builder.mutation({
            query: ({taskId, solution}) => ({
                url: `/solutions/${taskId}/`,
                method: "POST",
                body: solution,
            }),
            invalidatesTags: ["solution"],
        }),
        deleteSolution: builder.mutation({
            query: (solutionId) => ({
                url: `/solutions/${solutionId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["solution"],
        }),
        getSolutionFilesList: builder.query({
            query: (solutionId) => ({
                url: `/solutions/files/${solutionId}/`,
                method: "GET"
            }),
            providesTags: ["solution"],
        }),
        uploadFile: builder.mutation({
            query: ({solutionId, fileData}) => {
                if (!(fileData instanceof File)) {
                    throw new Error('Invalid file object');
                }
                const formData = new FormData();
                formData.append('file', fileData);
                return {
                    url: `/solutions/files/${solutionId}/upload/`,
                    method: 'POST',
                    formData: true,
                    body: formData,
                };
            },
            invalidatesTags: ["solution"],
        }),
        createAssessment: builder.mutation({
            query: ({solutionId, assessment}) => ({
                url: `/solutions/assessment/${solutionId}/`,
                method: "POST",
                body: assessment,
            }),
            invalidatesTags: ["solution"],
        }),
    }),
});

export const {
    useGetTaskSolutionsQuery,
    useGetTaskStudentSolutionsQuery,
    useCreateSolutionMutation,
    useDeleteSolutionMutation,
    useGetSolutionFilesListQuery,
    useUploadFileMutation,
    useCreateAssessmentMutation,
} = solutionsApi;

