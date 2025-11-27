import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import useAuthUtils from "../../Hooks/useAuthUtils.js";
import {Grid} from "antd";

const {useBreakpoint} = Grid;


const useMainLayout = () => {
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const {logoutAndRedirect} = useAuthUtils();
    const screens = useBreakpoint();

    const {userData: user, isLoading: isUserLoading, error: isUserError} = useSelector((state) => state.auth);

    const handleMenuClick = ({key}) => {
        if (key === "logout") {
            logoutAndRedirect();
            return;
        }
        navigate(key);
    };
    const getItem = (label, key, icon, children) => ({key, icon, children, label});

    return {
        screens,
        collapsed,
        setCollapsed,
        location,
        user,
        isUserLoading,
        isUserError,
        handleMenuClick,
        getItem
    };
};

export default useMainLayout;