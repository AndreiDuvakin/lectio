import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    selectedLessonToUpdate: null,
    openModalCreateLesson: false,
};

const lessonSlice = createSlice({
    name: "lessons",
    initialState,
    reducers: {
        setSelectedLessonToUpdate(state, action) {
            state.selectedLessonToUpdate = action.payload;
        },
        setOpenModalCreateLesson(state, action) {
            state.openModalCreateLesson = action.payload;
        },
    },
});

export const {setSelectedLessonToUpdate, setOpenModalCreateLesson} = lessonSlice.actions;

export default lessonSlice.reducer;