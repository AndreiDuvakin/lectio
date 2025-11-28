import {useDispatch, useSelector} from "react-redux";
import {Form, notification} from "antd";
import {setOpenModalCreateUser, setSelectedUserToUpdate} from "../../../../../Redux/Slices/usersSlice.js";
import {useGetAllRolesQuery} from "../../../../../Api/rolesApi.js";
import {useCreateUserMutation} from "../../../../../Api/usersApi.js";


const useCreateUserModalForm = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const {
        openModalCreateUser
    } = useSelector(state => state.users);

    const modalVisible = openModalCreateUser;

    const handleCancel = () => {
        dispatch(setOpenModalCreateUser(false));
    };

    const [
        registerUser,
        {
            isLoading: isLoadingRegister,
            isError: isErrorRegister,
        }
    ] = useCreateUserMutation();

    const handleFinish = async () => {
        const values = form.getFieldsValue();
        const payload = {
            ...values,
            birthdate: values.birthdate
                ? values.birthdate.format("YYYY-MM-DD")
                : null,
        };

        try {
            await registerUser(payload).unwrap();
            notification.success({
                title: "Пользователь зарегистрирован",
                description: "Пользователь успешно зарегистрирован",
                placement: "topRight",
            });
            form.resetFields();
            handleCancel();
        } catch (error) {
            notification.error({
                title: "Ошибка регистрации пользователя",
                description: error?.data?.detail || "Не удалось зарегистрировать пользователя",
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
        form,
        roles,
        isLoading: isLoadingRoles,
        isError: isErrorRoles,
    };
};

export default useCreateUserModalForm;