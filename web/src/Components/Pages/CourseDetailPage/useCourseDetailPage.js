import {useGetAuthenticatedUserDataQuery} from "../../../Api/usersApi.js";
import {useGetCourseByIdQuery} from "../../../Api/coursesApi.js";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {
    setOpenModalCreateLesson,
    setSelectedLessonToUpdate,
    setSelectedLessonToView
} from "../../../Redux/Slices/lessonsSlice.js";
import {useGetLessonsByCourseIdQuery} from "../../../Api/lessonsApi.js";
import {ROLES} from "../../../Core/constants.js";
import CONFIG from "../../../Core/сonfig.js";


const useCourseDetailPage = (courseId) => {
    const dispatch = useDispatch();

    const {
        data: userData,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useGetAuthenticatedUserDataQuery(undefined, {
        pollingInterval: 10000,
    });

    const {
        data: courseData,
        isLoading: isCourseLoading,
        isError: isCourseError,
    } = useGetCourseByIdQuery(courseId, {
        pollingInterval: 10000,
    });

    const {
        data: lessonsData,
        isLoading: isLessonsLoading,
        isError: isLessonsError,
    } = useGetLessonsByCourseIdQuery(courseId, {
        pollingInterval: 10000,
    });

    useEffect(() => {
        window.document.title = `Система обучения lectio - Курс: ${courseData?.title}`;
    }, [courseData]);

    const handleCreateLesson = () => {
        dispatch(setOpenModalCreateLesson(true))
    };

    const isTeacherOrAdmin = [CONFIG.ROOT_ROLE_NAME, ROLES.TEACHER].includes(userData?.role?.title);

    const handleOpenLesson = (lesson) => {
        dispatch(setSelectedLessonToView(lesson))
    };

    const handleEditLesson = (lesson) => {
        dispatch(setSelectedLessonToUpdate(lesson))
    };

    return {
        isTeacherOrAdmin,
        lessonsData,
        userData,
        courseData,
        isLoading: isUserLoading || isCourseLoading || isLessonsLoading,
        isError: isUserError || isCourseError || isLessonsError,
        handleCreateLesson,
        handleOpenLesson,
        handleEditLesson,
    }
};

export default useCourseDetailPage;