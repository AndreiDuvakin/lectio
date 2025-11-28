import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice.js";
import usersReducer from "./Slices/usersSlice.js";
import coursesReducer from "./Slices/coursesSlice.js";
import {authApi} from "../Api/authApi.js";
import {usersApi} from "../Api/usersApi.js";
import {rolesApi} from "../Api/rolesApi.js";
import {statusesApi} from "../Api/statusesApi.js";
import {coursesApi} from "../Api/coursesApi.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,

        users: usersReducer,
        [usersApi.reducerPath]: usersApi.reducer,

        [rolesApi.reducerPath]: rolesApi.reducer,

        [statusesApi.reducerPath]: statusesApi.reducer,

        courses: coursesReducer,
        [coursesApi.reducerPath]: coursesApi.reducer
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(
            authApi.middleware,
            usersApi.middleware,
            rolesApi.middleware,
            statusesApi.middleware,
            coursesApi.middleware
        )
    ),
});

export default store;