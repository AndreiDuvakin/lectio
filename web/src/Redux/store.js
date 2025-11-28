import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice.js";
import usersReducer from "./Slices/usersSlice.js";
import {authApi} from "../Api/authApi.js";
import {usersApi} from "../Api/usersApi.js";
import {rolesApi} from "../Api/rolesApi.js";
import {statusesApi} from "../Api/statusesApi.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,

        users: usersReducer,
        [usersApi.reducerPath]: usersApi.reducer,

        [rolesApi.reducerPath]: rolesApi.reducer,

        [statusesApi.reducerPath]: statusesApi.reducer
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(
            authApi.middleware,
            usersApi.middleware,
            rolesApi.middleware,
            statusesApi.middleware,
        )
    ),
});

export default store;