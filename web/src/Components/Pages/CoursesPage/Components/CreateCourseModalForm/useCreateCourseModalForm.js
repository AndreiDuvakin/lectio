import {useDispatch, useSelector} from "react-redux";
import {setOpenCreateCourseModal} from "../../../../../Redux/Slices/coursesSlice.js";
import {Form, notification} from "antd";
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
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newCourse = await createCourse({
                title: values.title,
                description: values.description || null,
            }).unwrap();

            if (values.teacher_ids?.length > 0) {
                const teachersPayload = values.teacher_ids.map(id => ({
                    teacher_id: id
                }));

                await replaceTeachers({
                    courseId: newCourse.id,
                    teachers: teachersPayload
                }).unwrap();
            }

            if (values.student_ids?.length > 0) {
                const studentsPayload = values.student_ids.map(id => ({
                    student_id: id,
                }));
                await replaceStudents({
                    courseId: newCourse.id,
                    students: studentsPayload
                }).unwrap();
            }

            notification.success({
                title: "Успешно",
                description: "Курс успешно создан!",
                placement: "topRight",
            });

            form.resetFields();
            dispatch(setOpenCreateCourseModal(false));
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Не удалось создать курс.",
                placement: "topRight",
            });
        }
    };

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