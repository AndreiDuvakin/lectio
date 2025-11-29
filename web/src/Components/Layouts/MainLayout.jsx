import useMainLayout from "./useMainLayout.js";
import {Layout, Menu} from "antd";
import CoursesPage from "../Pages/CoursesPage/CoursesPage.jsx";
import LoadingIndicator from "../Widgets/LoadingIndicator/LoadingIndicator.jsx";
import {Outlet} from "react-router-dom";
import {BookOutlined, ControlOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import CONFIG from "../../Core/сonfig.js";

const {Content, Footer, Sider} = Layout;

const MainLayout = () => {
    const {
        screens,
        collapsed,
        setCollapsed,
        location,
        user,
        isUserLoading,
        isUserError,
        handleMenuClick,
        getItem
    } = useMainLayout();

    const menuItems = [
        getItem("Мои курсы", "/courses", <BookOutlined/>),
        {type: "divider"}
    ];

    if (user.role.title === CONFIG.ROOT_ROLE_NAME) {
        menuItems.push(
            getItem("Панель администратора", "/admin", <ControlOutlined/>)
        )
    }

    menuItems.push(
        getItem("Профиль", "/profile", <UserOutlined/>),
        getItem("Выйти", "logout", <LogoutOutlined/>),
    )

    return (
        <Layout style={{minHeight: "100vh", margin: "-0.4vw"}}>
            <Sider
                collapsible={!screens.xs}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                style={{height: "100vh", position: "fixed", left: 0, overflow: "auto"}}
            >
                <div style={{display: "flex", justifyContent: "center", padding: 16}}>
                    <img
                        src="/rounded_logo.png"
                        alt="Логотип"
                        style={{width: collapsed ? 40 : 80, transition: "width 0.2s"}}
                    />
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>

            <Layout
                style={{marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s"}}
            >
                <Content style={{
                    margin: "0 16px",
                    padding: 24,
                    minHeight: "100vh",
                    overflow: "auto",
                    background: "#fff",
                    borderRadius: 8,
                    marginTop: "15px"
                }}>
                    {isUserLoading ? (
                        <LoadingIndicator/>
                    ) : (
                        <Outlet/>
                    )}
                </Content>
                <Footer style={{textAlign: "center"}}>lectio © {new Date().getFullYear()}</Footer>
            </Layout>
        </Layout>
    )

};

export default MainLayout;