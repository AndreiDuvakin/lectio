import {useGetAuthenticatedUserDataQuery} from "../../../Api/usersApi.js";
import {useGetCourseByIdQuery} from "../../../Api/coursesApi.js";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {
    setOpenModalCreateLesson,
    setSelectedLessonToUpdate,
    setSelectedLessonToView
} from "../../../Redux/Slices/lessonsSlice.js";
import {useDeleteLessonMutation, useGetLessonsByCourseIdQuery} from "../../../Api/lessonsApi.js";
import {ROLES} from "../../../Core/constants.js";
import CONFIG from "../../../Core/сonfig.js";
import {notification} from "antd";
import {
    setOpenModalCreateTask,
    setSelectedTaskToUpdate,
    setSelectedTaskToView
} from "../../../Redux/Slices/tasksSlice.js";
import {useDeleteTaskMutation, useGetTasksByCourseIdQuery} from "../../../Api/tasksApi.js";


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
        data: lessonsData = [],
        isLoading: isLessonsLoading,
        isError: isLessonsError,
    } = useGetLessonsByCourseIdQuery(courseId, {
        pollingInterval: 10000,
    });

    const {
        data: tasksData = [],
        isLoading: isTasksLoading,
        isError: isTasksError
    } = useGetTasksByCourseIdQuery(courseId, {
        pollingInterval: 10000,
    });

    const [
        deleteLesson,
    ] = useDeleteLessonMutation();

    const [
        deleteTask,
    ] = useDeleteTaskMutation();

    const handleDeleteLesson = async (lessonId) => {
        try {
            await deleteLesson(lessonId);

            notification.success({
                title: "Успешно",
                description: "Лекция удалена",
                placement: "topRight",
            });
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Произошла ошибка при удалении лекции",
                placement: "topRight",
            })
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            notification.success({
                title: "Успешно",
                description: "Задание удалено",
                placement: "topRight",
            });
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Произошла ошибка при удалении задания",
                placement: "topRight",
            })
        }
    };

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

    const handleCreateTask = () => {
        dispatch(setOpenModalCreateTask(true))
    };

    const handleOpenTask = (task) => {
        dispatch(setSelectedTaskToView(task))
    };

    const handleEditTask = (task) => {
        dispatch(setSelectedTaskToUpdate(task))
    };

    return {
        tasksData,
        isTeacherOrAdmin,
        lessonsData,
        userData,
        courseData,
        isLoading: isUserLoading || isCourseLoading || isLessonsLoading || isTasksLoading,
        isError: isUserError || isCourseError || isLessonsError || isTasksError,
        handleCreateLesson,
        handleOpenLesson,
        handleEditLesson,
        handleDeleteLesson,
        handleCreateTask,
        handleOpenTask,
        handleEditTask,
        handleDeleteTask,
    }
};

export default useCourseDetailPage;