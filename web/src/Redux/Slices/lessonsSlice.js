import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    selectedLessonToUpdate: null,
    openModalCreateLesson: false,
    selectedLessonToView: null,
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
        setSelectedLessonToView(state, action) {
            state.selectedLessonToView = action.payload;
        }
    },
});

export const {
    setSelectedLessonToUpdate,
    setOpenModalCreateLesson,
    setSelectedLessonToView,
} = lessonSlice.actions;

export default lessonSlice.reducer;