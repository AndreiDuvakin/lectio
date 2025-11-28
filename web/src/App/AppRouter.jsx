import {Routes, Route, Navigate} from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import LoginPage from "../Components/Pages/LoginPage/LoginPage.jsx";
import CoursesPage from "../Components/Pages/CoursesPage/CoursesPage.jsx";
import MainLayout from "../Components/Layouts/MainLayout.jsx";
import ProfilePage from "../Components/Pages/ProfilePage/ProfilePage.jsx";
import AdminPage from "../Components/Pages/AdminPage/AdminPage.jsx";
import CourseDetailPage from "../Components/Pages/CourseDetailPage/CourseDetailPage.jsx";


const AppRouter = () => (
    <Routes>
        <Route path="/login" element={<LoginPage/>}/>

        <Route element={<PrivateRoute/>}>
            <Route element={<MainLayout/>}>
                <Route path={"/courses"} element={<CoursesPage/>}/>
                <Route path={"/profile"} element={<ProfilePage/>}/>
                <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                <Route path={"*"} element={<Navigate to={"/courses"}/>}/>
            </Route>
        </Route>

        <Route element={<AdminRoute/>}>
            <Route element={<MainLayout />}>
                <Route path="/admin" element={<AdminPage />} />
            </Route>
        </Route>

        <Route path={"*"} element={<Navigate to={"/"}/>}/>
    </Routes>
);

export default AppRouter;