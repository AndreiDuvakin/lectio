import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const useRegisterPage = () => {
    const navigate = useNavigate();

    const pageContainerStyle = {
        width: 450,
        padding: 40,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
    };

    const onFinish = (values) => {
        console.log('Регистрация:', values);
        message.success('Регистрация выполнена успешно!');
        navigate('/login');
    };

    return {
        pageContainerStyle,
        onFinish
    };
};

export default useRegisterPage;