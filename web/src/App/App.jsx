import {useEffect} from 'react'
import '../Styles/App.css'
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import LoadingIndicator from "../Components/Widgets/LoadingIndicator/LoadingIndicator.jsx";
import {checkAuth} from "../Redux/Slices/authSlice.js";
import {ConfigProvider} from "antd";
import locale from 'antd/locale/ru_RU';
import ErrorBoundary from "./ErrorBoundary.jsx";
import AppRouter from "./AppRouter.jsx";
import {BrowserRouter as Router} from "react-router-dom";

dayjs.locale('ru');

function App() {
    const dispatch = useDispatch();
    const {isLoading} = useSelector((state) => state.auth);


    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (isLoading) {
        return <LoadingIndicator/>;
    }

    return (
        <Router>
            <ConfigProvider
                locale={locale}
            >
                <ErrorBoundary>
                    <AppRouter/>
                </ErrorBoundary>
            </ConfigProvider>
        </Router>
    )
}

export default App
