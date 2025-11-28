import {useDispatch, useSelector} from "react-redux";
import {setSelectedLessonToView} from "../../../../../Redux/Slices/lessonsSlice.js";


const useViewLessonModal = () => {
    const dispatch = useDispatch();

    const {
        selectedLessonToView
    } = useSelector((state) => state.lessons);

    const modalIsOpen = selectedLessonToView !== null;

    const handleClose = () => {
        dispatch(setSelectedLessonToView(null));
    };

    return {
        selectedLessonToView,
        modalIsOpen,
        handleClose,
    }
};

export default useViewLessonModal;