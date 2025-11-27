import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import LoadingIndicator from "../Components/Widgets/LoadingIndicator/LoadingIndicator.jsx";

const PrivateRoute = () => {
    const {user, userData, isLoading} = useSelector((state) => state.auth);

    if (isLoading) {
        return <LoadingIndicator/>;
    }

    if (!user || !userData || userData.status.title !== "active") {
        return <Navigate to="/login"/>;
    }

    return <Outlet/>;
};

export default PrivateRoute;