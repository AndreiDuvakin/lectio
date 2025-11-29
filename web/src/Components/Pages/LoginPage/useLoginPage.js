import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../../Api/authApi.js";
import { useEffect, useRef } from "react";
import { notification } from "antd";
import { checkAuth, setError, setUser } from "../../../Redux/Slices/authSlice.js";
import { message } from "antd";

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginUser, { isLoading }] = useLoginMutation();
    const { user, userData } = useSelector((state) => state.auth);
    const hasRedirected = useRef(false);

    const pageContainerStyle = {
        width: 400,
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
    };

    useEffect(() => {
        if (user && userData && !isLoading && !hasRedirected.current) {
            hasRedirected.current = true;
            navigate("/");
        }
        document.title = "Система обучения lectio - Аутентификация";
    }, [user, userData, isLoading, navigate]);

    const onFinish = async (loginData) => {
        // РЕАЛЬНАЯ АВТОРИЗАЦИЯ
        try {
            const response = await loginUser(loginData).unwrap();
            const token = response.access_token || response.token;
            if (!token) {
                throw new Error("Сервер не вернул токен авторизации");
            }
            localStorage.setItem("access_token", token);
            dispatch(setUser({ token }));

            await dispatch(checkAuth()).unwrap();
        } catch (error) {
            const errorMessage = error?.data?.detail || "Не удалось войти. Проверьте логин и пароль.";
            console.error(error);
            dispatch(setError(errorMessage));
            notification.error({
                title: "Ошибка при входе",
                description: errorMessage,
                placement: "topRight",
            });
        }
    };

    return {
        pageContainerStyle,
        onFinish,
        isLoading
    };
};

export default LoginPage;