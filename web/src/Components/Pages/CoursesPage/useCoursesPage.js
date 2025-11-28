import {useGetAuthenticatedUserDataQuery} from "../../../Api/usersApi.js";
import {useGetAllCoursesQuery, useGetAllMyCoursesQuery} from "../../../Api/coursesApi.js";
import CONFIG from "../../../Core/сonfig.js";
import {ROLES} from "../../../Core/constants.js";
import {useDispatch} from "react-redux";
import {setOpenCreateCourseModal, setSelectedCourseToUpdate} from "../../../Redux/Slices/coursesSlice.js";
import {useEffect} from "react";


const useCoursesPage = () => {
    const dispatch = useDispatch();

    const {data: userData, isLoading: isUserLoading} = useGetAuthenticatedUserDataQuery();
    const {data: courses = [], isLoading, isCoursesLoading, isError} = useGetAllMyCoursesQuery(undefined, {
        pollingInterval: 20000,
    });

    const isAdmin = userData?.role?.title === CONFIG.ROOT_ROLE_NAME;
    const isTeacher = [CONFIG.ROOT_ROLE_NAME, ROLES.TEACHER].includes(userData?.role?.title);

    const openCreateModal = () => {
        dispatch(setOpenCreateCourseModal(true));
    };

    const openEditModal = (course) => {
        dispatch(setSelectedCourseToUpdate(course));
    };

    useEffect(() => {
        window.document.title = "Система обучения lectio - Курсы";
    }, []);

    return {
        courses,
        isLoading: isCoursesLoading || isUserLoading || isLoading,
        isError,
        isAdmin,
        isTeacher,
        openCreateModal,
        openEditModal,
    };
};

export default useCoursesPage;