import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice.js";
import {authApi} from "../Api/authApi.js";
import {usersApi} from "../Api/usersApi.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,

        [usersApi.reducerPath]: usersApi.reducer
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(
            authApi.middleware,
            usersApi.middleware,
        )
    ),
});

export default store;