import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice.js";
import usersReducer from "./Slices/usersSlice.js";
import coursesReducer from "./Slices/coursesSlice.js";
import lessonReducer from "./Slices/lessonsSlice.js";
import tasksReducer from "./Slices/tasksSlice.js";
import {authApi} from "../Api/authApi.js";
import {usersApi} from "../Api/usersApi.js";
import {rolesApi} from "../Api/rolesApi.js";
import {statusesApi} from "../Api/statusesApi.js";
import {coursesApi} from "../Api/coursesApi.js";
import {lessonsApi} from "../Api/lessonsApi.js";
import {tasksApi} from "../Api/tasksApi.js";
import {solutionsApi} from "../Api/solutionsApi.js";
import {commentsApi} from "../Api/commentsApi.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,

        users: usersReducer,
        [usersApi.reducerPath]: usersApi.reducer,

        [rolesApi.reducerPath]: rolesApi.reducer,

        [statusesApi.reducerPath]: statusesApi.reducer,

        courses: coursesReducer,
        [coursesApi.reducerPath]: coursesApi.reducer,

        lessons: lessonReducer,
        [lessonsApi.reducerPath]: lessonsApi.reducer,

        tasks: tasksReducer,
        [tasksApi.reducerPath]: tasksApi.reducer,

        [solutionsApi.reducerPath]: solutionsApi.reducer,

        [commentsApi.reducerPath]: commentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(
            authApi.middleware,
            usersApi.middleware,
            rolesApi.middleware,
            statusesApi.middleware,
            coursesApi.middleware,
            lessonsApi.middleware,
            tasksApi.middleware,
            solutionsApi.middleware,
            commentsApi.middleware,
        )
    ),
});

export default store;