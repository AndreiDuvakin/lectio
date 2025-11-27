import {Navigate, Outlet} from "react-router-dom";
import {useGetAuthenticatedUserDataQuery} from "../Api/usersApi.js";
import LoadingIndicator from "../Components/Widgets/LoadingIndicator/LoadingIndicator.jsx";
import {Result} from "antd";

const AdminRoute = () => {
    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useGetAuthenticatedUserDataQuery(undefined, {
        pollingInterval: 20000,
    });

    if (isUserLoading) {
        return <LoadingIndicator/>;
    }

    if (isUserError) {
        return <Result status="500" title="500" subTitle="Произошла ошибка при загрузке данных пользователя"/>;
    }

    if (!user) {
        return <Navigate to="/login"/>;
    }

    if (!user.role || user.role.title !== "Администратор") {
        return <Navigate to="/"/>;
    }

    return <Outlet/>;
};

export default AdminRoute;