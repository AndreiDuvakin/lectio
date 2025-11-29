import {message, notification} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useRegisterUserMutation} from "../../../Api/usersApi.js";

const useRegisterPage = () => {
    const navigate = useNavigate();

    const [
        createUser,
        {
            isLoading,
            isError,
        }
    ] = useRegisterUserMutation();

    const pageContainerStyle = {
        width: 450,
        padding: 40,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
    };

    const onFinish = async (values) => {
        const payload = {
            ...values,
            birthdate: values.birthdate
                ? values.birthdate.format("YYYY-MM-DD")
                : null,
        };
        console.log(payload)
        try {
            await createUser(payload);

            notification.success({
                title: "Успешно",
                message: "Пользователь успешно создан",
                placement: "topRight",
            })
            navigate('/login');
        } catch {
            notification.error({
                title: "Ошибка",
                message: "Пользователь не создан",
                placement: "topRight",
            })
        }
    };

    return {
        pageContainerStyle,
        onFinish
    };
};

export default useRegisterPage;