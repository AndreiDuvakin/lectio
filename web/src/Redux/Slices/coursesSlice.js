import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    selectedCourseToUpdate: null,
    openCreateCourseModal: false,
};

export const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        setSelectedCourseToUpdate(state, action) {
            state.selectedCourseToUpdate = action.payload;
        },
        setOpenCreateCourseModal(state, action) {
            state.openCreateCourseModal = action.payload;
        },
    },
});

export const {setSelectedCourseToUpdate, setOpenCreateCourseModal} = coursesSlice.actions;
export default coursesSlice.reducer;