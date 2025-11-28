import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import CONFIG from "../Core/сonfig.js";
import {baseQueryWithAuth} from "./baseQuery.js";


export const statusesApi = createApi({
    reducerPath: 'statusesApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Statuses'],
    endpoints: (builder) => ({
        getStatuses: builder.query({
            query: () => '/statuses/',
            providesTags: ['Statuses'],
        }),
    }),
});

export const {
    useGetStatusesQuery,
} = statusesApi;