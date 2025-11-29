import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithAuth} from "./baseQuery.js";


export const commentsApi = createApi({
    reducerPath: "commentsApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["comments"],
    endpoints: (builder) => ({
        getAllCommentsBySolutionId: builder.query({
            query: (solutionId) => ({
                url: `/comments/solution/${solutionId}/`,
                method: "GET"
            }),
            providesTags: ["comments"],
        }),
        createComment: builder.mutation({
            query: ({solutionId, comment}) => ({
                url: `/comments/solution/${solutionId}/`,
                method: "POST",
                body: comment,
            }),
            invalidatesTags: ["comments"],
        }),
        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `/comments/${commentId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["comments"],
        }),
    })
});

export const {
    useGetAllCommentsBySolutionIdQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;