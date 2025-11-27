import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {logout} from '../Redux/Slices/authSlice.js';
import CONFIG from "../Core/сonfig.js";

export const baseQuery = fetchBaseQuery({
    baseUrl: CONFIG.BASE_URL,
    prepareHeaders: (headers, {getState, endpoint}) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        if (endpoint === 'uploadAppointmentFile' || endpoint === 'uploadBackup') {
            const mutation = getState()?.api?.mutations?.[Object.keys(getState()?.api?.mutations || {})[0]];
            if (mutation?.body instanceof FormData) {
                headers.delete('Content-Type');
            }
        } else {
            headers.set('Content-Type', 'application/json');
        }

        return headers;
    },
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && [401, 403].includes(result.error.status)) {
        localStorage.removeItem('access_token');
        api.dispatch(logout());
        window.location.href = '/login';
    }
    return result;
};