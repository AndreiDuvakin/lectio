import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    selectedUserToUpdate: null,
    openModalCreateUser: false,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setSelectedUserToUpdate(state, action) {
            state.selectedUserToUpdate = action.payload;
        },
        setOpenModalCreateUser(state, action) {
            state.openModalCreateUser = action.payload;
        },
    },
});

export const {setSelectedUserToUpdate, setOpenModalCreateUser} = usersSlice.actions;

export default usersSlice.reducer;