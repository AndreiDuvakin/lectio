import {useDispatch, useSelector} from "react-redux";
import {setOpenCreateCourseModal} from "../../../../../Redux/Slices/coursesSlice.js";
import {Form} from "antd";
import {useGetUsersByRoleNameQuery} from "../../../../../Api/usersApi.js";
import {
    useCreateCourseMutation,
    useReplaceCourseStudentsMutation,
    useReplaceCourseTeachersMutation
} from "../../../../../Api/coursesApi.js";


const useCreateCourseModalForm = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const {
        data: teachers = [],
        isLoading: isTeachersLoading,
        isError: isTeachersError,
    } = useGetUsersByRoleNameQuery("teacher", {
        pollingInterval: 20000,
    });

    const {
        data: students = [],
        isLoading: isStudentsLoading,
        isError: isStudentsError,
    } = useGetUsersByRoleNameQuery("student", {
        pollingInterval: 20000,
    });

    const [createCourse, {isLoading: creatingCourse}] = useCreateCourseMutation();
    const [replaceTeachers, {isLoading: replacingTeachers}] = useReplaceCourseTeachersMutation();
    const [replaceStudents, {isLoading: replacingStudents}] = useReplaceCourseStudentsMutation();

    const isLoading = isTeachersLoading || isStudentsLoading || creatingCourse || replacingTeachers || replacingStudents;
    const isError = isTeachersError || isStudentsError;

    const {
        openCreateCourseModal
    } = useSelector((state) => state.courses);

    const handleCancel = () => {
        form.resetFields();
        dispatch(setOpenCreateCourseModal(false));
    }

    return {
        openCreateCourseModal,
        handleCancel,
        handleOk,
        form,
        teachers,
        students,
        isLoading,
        isError,
    }
};

export default useCreateCourseModalForm;