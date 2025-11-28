import {useGetAuthenticatedUserDataQuery} from "../../../Api/usersApi.js";
import {useGetCourseByIdQuery} from "../../../Api/coursesApi.js";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setOpenModalCreateLesson} from "../../../Redux/Slices/lessonsSlice.js";


const useCourseDetailPage = (courseId) => {
    const dispatch = useDispatch();

    const {
        data: userData,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useGetAuthenticatedUserDataQuery(undefined, {
        pollingInterval: 60000,
    });

    const {
        data: courseData,
        isLoading: isCourseLoading,
        isError: isCourseError,
    } = useGetCourseByIdQuery(courseId, {
        pollingInterval: 60000,
    });

    useEffect(() => {
        window.document.title = `Система обучения lectio - Курс: ${courseData?.title}`;
    }, [courseData]);

    const handleCreateLesson = () => {
        dispatch(setOpenModalCreateLesson(true))
    };

    return {
        userData,
        courseData,
        isLoading: isUserLoading || isCourseLoading,
        isError: isUserError || isCourseError,
        handleCreateLesson,
    }
};

export default useCourseDetailPage;