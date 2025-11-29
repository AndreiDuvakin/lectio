import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    selectedTaskToUpdate: null,
    openModalCreateTask: false,
    selectedTaskToView: null,
}

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setSelectedTaskToUpdate: (state, action) => {
            state.selectedTaskToUpdate = action.payload;
        },
        setOpenModalCreateTask: (state, action) => {
            state.openModalCreateTask = action.payload;
        },
        setSelectedTaskToView: (state, action) => {
            state.selectedTaskToView = action.payload;
        },
    },
});

export const {
    setSelectedTaskToUpdate,
    setOpenModalCreateTask,
    setSelectedTaskToView,
} = tasksSlice.actions;

export default tasksSlice.reducer;