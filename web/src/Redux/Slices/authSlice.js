import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {usersApi} from "../../Api/usersApi.js";

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { dispatch, rejectWithValue }) => {
    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            return rejectWithValue("No token found");
        }

        const userData = await dispatch(
            usersApi.endpoints.getAuthenticatedUserData.initiate(undefined, { forceRefetch: true })
        ).unwrap();

        return { token, userData };
    } catch (error) {
        localStorage.removeItem("access_token");
        return rejectWithValue(error?.data?.detail || "Failed to authenticate");
    }
});

const initialState = {
    user: null,
    userData: null,
    isLoading: true,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setError(state, action) {
            state.error = action.payload;
            state.isLoading = false;
        },
        logout(state) {
            state.user = null;
            state.userData = null;
            state.error = null;
            state.isLoading = false;
            localStorage.removeItem("access_token");
        },
        setUserData(state, action) {
            state.userData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = { token: action.payload.token };
                state.userData = action.payload.userData;
                state.isLoading = false;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.user = null;
                state.userData = null;
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setUser, setError, logout, setUserData } = authSlice.actions;
export default authSlice.reducer;