import {useDispatch, useSelector} from "react-redux";
import {setSelectedCourseToUpdate} from "../../../../../Redux/Slices/coursesSlice.js";
import {Form, notification} from "antd";
import {useGetUsersByRoleNameQuery} from "../../../../../Api/usersApi.js";
import {
    useGetCourseStudentsQuery, useGetCourseTeachersQuery,
    useReplaceCourseStudentsMutation,
    useReplaceCourseTeachersMutation, useUpdateCourseMutation
} from "../../../../../Api/coursesApi.js";
import {useEffect} from "react";
import {ROLES} from "../../../../../Core/constants.js";


const useUpdateCourseModalForm = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const {selectedCourseToUpdate} = useSelector((state) => state.courses);
    const courseId = selectedCourseToUpdate?.id;

    const isModalOpen = selectedCourseToUpdate !== null;

    const {
        data: allTeachers = [],
        isLoading: teachersLoading,
        isError: teachersError,
    } = useGetUsersByRoleNameQuery(ROLES.TEACHER);

    const {
        data: allStudents = [],
        isLoading: studentsLoading,
        isError: studentsError,
    } = useGetUsersByRoleNameQuery(ROLES.STUDENT);

    const {
        data: currentTeachers = [],
        isLoading: currentTeachersLoading,
    } = useGetCourseTeachersQuery(courseId, {skip: !courseId});

    const {
        data: currentStudents = [],
        isLoading: currentStudentsLoading,
    } = useGetCourseStudentsQuery(courseId, {skip: !courseId});

    const [updateCourse, {isLoading: updating}] = useUpdateCourseMutation();
    const [replaceTeachers] = useReplaceCourseTeachersMutation();
    const [replaceStudents] = useReplaceCourseStudentsMutation();

    const isLoading = teachersLoading || studentsLoading || updating || currentTeachersLoading || currentStudentsLoading;
    const isError = teachersError || studentsError;

    useEffect(() => {
        if (selectedCourseToUpdate) {
            form.setFieldsValue({
                title: selectedCourseToUpdate.title,
                description: selectedCourseToUpdate.description || "",
                teacher_ids: currentTeachers.map(t => t.teacher_id),
                student_ids: currentStudents.map(s => s.student_id),
            });
        }
    }, [selectedCourseToUpdate, currentTeachers, currentStudents, form]);

    const handleCancel = () => {
        form.resetFields();
        dispatch(setSelectedCourseToUpdate(null));
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            await updateCourse({
                courseId: courseId,
                title: values.title,
                description: values.description || null,
            }).unwrap();

            const teachersPayload = (values.teacher_ids || []).map(id => ({teacher_id: id}));
            await replaceTeachers({
                courseId,
                teachers: teachersPayload,
            }).unwrap();

            const studentsPayload = (values.student_ids || []).map(id => ({student_id: id}));
            await replaceStudents({
                courseId,
                students: studentsPayload,
            }).unwrap();

            notification.success({
                title: "Успех",
                description: "Курс успешно обновлён!",
            });

            handleCancel();
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Не удалось обновить курс",
            });
        }
    };

    return {
        isModalOpen,
        handleCancel,
        handleOk,
        form,
        teachers: allTeachers,
        students: allStudents,
        isLoading,
        isError,
    };
};

export default useUpdateCourseModalForm;