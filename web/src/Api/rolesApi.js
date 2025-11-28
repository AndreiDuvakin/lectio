import {baseQueryWithAuth} from "./baseQuery.js";
import {createApi} from "@reduxjs/toolkit/query/react";


export const rolesApi = createApi({
    reducerPath: "rolesApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["role"],
    endpoints: (builder) => ({
        getAllRoles: builder.query({
            query: () => ({
                url: "/roles/",
                method: "GET",
            }),
            providesTags: ["role"],
        }),
    }),
});

export const {useGetAllRolesQuery} = rolesApi;