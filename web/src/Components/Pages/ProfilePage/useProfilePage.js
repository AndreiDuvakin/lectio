import {useEffect} from "react";
import {
    useGetAuthenticatedUserDataQuery,
    useUpdateUserMutation,
    useUpdateUserPasswordMutation
} from "../../../Api/usersApi.js";
import {Form, notification} from "antd";
import dayjs from "dayjs";


const useProfilePage = () => {
    const [userForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    useEffect(() => {
        window.document.title = "Профиль";
    }, []);

    const {
        data: userData = {},
        isLoading: isUserDataLoading,
        isError: isUserDataError,
    } = useGetAuthenticatedUserDataQuery(undefined, {
        pollingInterval: 20000,
    });

    const [
        updateUser,
        {
            isLoading: isUpdateUserLoading,
            isError: isUpdateUserError,
        }
    ] = useUpdateUserMutation();

    const [
        updateUserPassword,
        {
            isLoading: isUpdateUserPasswordLoading,
            isError: isUpdateUserPasswordError,
        }
    ] = useUpdateUserPasswordMutation();


    useEffect(() => {
        if (userData && Object.keys(userData).length > 0) {
            const formattedValues = {
                ...userData,
                birthdate: userData.birthdate ? dayjs(userData.birthdate) : null,
            };
            userForm.setFieldsValue(formattedValues);
        }
    }, [userData, userForm]);

    const onFinishProfileForm = async () => {
        const values = userForm.getFieldsValue();
        const payload = {
            ...values,
            birthdate: values.birthdate
                ? values.birthdate.format("YYYY-MM-DD")
                : null,
        };

        try {
            await updateUser({userId: userData.id, ...payload}).unwrap();

            notification.success({
                title: "Успешно",
                description: "Данные успешно обновлены",
                placement: "topRight",
            });
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Не удалось обновить профиль.",
                placement: "topRight",
            });
        }
    };

    const onFinishPasswordForm = async () => {
        const values = passwordForm.getFieldsValue();
        const payload = {
            ...values,
        };

        try {
            await updateUserPassword({userId: userData.id, ...payload}).unwrap();
            passwordForm.resetFields();

            notification.success({
                title: "Успешно",
                description: "Пароль успешно обновлен",
                placement: "topRight",
            });
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Не удалось обновить пароль.",
                placement: "topRight",
            });
        }
    };

    return {
        userForm,
        passwordForm,
        userData,
        isLoading: isUserDataLoading,
        isError: isUserDataError,
        isUpdateUserLoading,
        isUpdateUserError,
        onFinishProfileForm,
        onFinishPasswordForm,
    }
};

export default useProfilePage;