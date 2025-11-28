import {useDispatch, useSelector} from "react-redux";
import {Form, notification} from "antd";
import {setSelectedUserToUpdate} from "../../../../../Redux/Slices/usersSlice.js";
import {useGetAllRolesQuery} from "../../../../../Api/rolesApi.js";
import {useEffect} from "react";
import dayjs from "dayjs";
import {useUpdateUserMutation, useUpdateUserPasswordMutation} from "../../../../../Api/usersApi.js";
import {useGetStatusesQuery} from "../../../../../Api/statusesApi.js";


const useUpdateUserModalForm = () => {
    const dispatch = useDispatch();
    const [userForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const {
        selectedUserToUpdate
    } = useSelector(state => state.users);

    const modalVisible = selectedUserToUpdate !== null;

    const handleCancel = () => {
        dispatch(setSelectedUserToUpdate(null));
    };

    const [
        updateUser,
        {
            isLoading: isLoadingUpdate,
            isError: isErrorUpdate,
        }
    ] = useUpdateUserMutation();

    const [
        changeUserPassword,
        {
            isLoading: isLoadingChangePassword,
            isError: isErrorChangePassword,
        }
    ] = useUpdateUserPasswordMutation();

    const {
        data: statusesData = [],
        isLoading: statusesIsLoading,
        isError: statusesIsError,
    } = useGetStatusesQuery(undefined);

    useEffect(() => {
        if (selectedUserToUpdate) {
            const { role, ...userWithoutRole } = selectedUserToUpdate;

            userForm.setFieldsValue({
                ...userWithoutRole,
                role_id: role?.id,
                birthdate: selectedUserToUpdate.birthdate
                    ? dayjs(selectedUserToUpdate.birthdate)
                    : null,
            });
        }
    }, [selectedUserToUpdate, userForm]);

    const handlePasswordFinish = async () => {
        const values = passwordForm.getFieldsValue();
        const payload = {
            ...values,
        };

        try {
            await changeUserPassword({userId: selectedUserToUpdate.id, ...payload}).unwrap();
            notification.success({
                title: "Пароль изменен",
                description: "Пароль успешно изменен",
                placement: "topRight",
            });
            passwordForm.resetFields();
            handleCancel();
        } catch (error) {
            notification.error({
                title: "Ошибка изменения пароля",
                description: error?.data?.detail || "Не удалось изменить пароль",
                placement: "topRight",
            });
        }
    };

    const handleFinish = async () => {
        const values = userForm.getFieldsValue();
        const payload = {
            ...values,
            birthdate: values.birthdate
                ? values.birthdate.format("YYYY-MM-DD")
                : null,
        };

        try {
            await updateUser({userId: selectedUserToUpdate.id, ...payload}).unwrap();
            notification.success({
                title: "Пользователь изменен",
                description: "Пользователь успешно изменен",
                placement: "topRight",
            });
            userForm.resetFields();
            handleCancel();
        } catch (error) {
            notification.error({
                title: "Ошибка изменения пользователя",
                description: error?.data?.detail || "Не удалось изменить пользователя",
                placement: "topRight",
            });
        }
    };

    const {
        data: roles = [],
        isLoading: isLoadingRoles,
        isError: isErrorRoles,
    } = useGetAllRolesQuery(undefined, {
        pollingInterval: 60000,
    });

    return {
        modalVisible,
        handleCancel,
        handleFinish,
        userForm,
        passwordForm,
        roles,
        isLoading: isLoadingRoles | statusesIsLoading,
        isError: isErrorRoles | statusesIsError,
        isLoadingUpdate,
        isErrorUpdate,
        handlePasswordFinish,
        statusesData,
    };
};

export default useUpdateUserModalForm;