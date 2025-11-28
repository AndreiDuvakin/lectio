import useProfilePage from "./useProfilePage.js";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Result,
    Row,
    Typography,
    Avatar,
    Space,
    Divider,
    Upload,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    CalendarOutlined,
    SaveOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import LoadingIndicator from "../../Widgets/LoadingIndicator/LoadingIndicator.jsx";

const {Title, Text} = Typography;

const ProfilePage = () => {
    const {
        userForm,
        passwordForm,
        userData,
        isLoading,
        isError,
        isUpdateUserLoading,
        isUpdateUserError,
        onFinishProfileForm,
        onFinishPasswordForm,
    } = useProfilePage();

    if (isError) {
        return (
            <Result
                status="error"
                title="Ошибка загрузки профиля"
                subTitle="Не удалось загрузить данные. Попробуйте обновить страницу."
            />
        );
    }

    if (isLoading) {
        return <LoadingIndicator/>;
    }

    return (
        <Row justify="center" style={{padding: "24px 16px", minHeight: "100vh", background: "#f5f5f5"}}>
            <Col xs={24} sm={22} md={20} lg={16} xl={12}>
                <Card
                    title={
                        <Space>
                            <Avatar size={40} icon={<UserOutlined/>} style={{backgroundColor: "#1890ff"}}/>
                            <div>
                                <Title level={4} style={{margin: -3}}>
                                    {userData?.first_name} {userData?.last_name}
                                </Title>
                                <Text type="secondary">Роль: {userData?.role?.title || "Пользователь"}</Text>
                            </div>
                        </Space>
                    }
                    style={{borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: 24}}
                >
                    <Form form={userForm} layout="vertical" onFinish={onFinishProfileForm}>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="first_name"
                                    label="Имя"
                                    rules={[{required: true, message: "Введите имя"}]}
                                >
                                    <Input prefix={<UserOutlined/>} placeholder="Иван" size="large"/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="last_name"
                                    label="Фамилия"
                                    rules={[{required: true, message: "Введите фамилию"}]}
                                >
                                    <Input prefix={<UserOutlined/>} placeholder="Иванов" size="large"/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item name="patronymic" label="Отчество">
                                    <Input prefix={<UserOutlined/>} placeholder="Иванович" size="large"/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{required: true, type: "email", message: "Введите корректный email"}]}
                                >
                                    <Input prefix={<MailOutlined/>} placeholder="ivan@example.com" size="large"/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="birthdate"
                                    label="Дата рождения"
                                    rules={[{required: true, message: "Выберите дату рождения"}]}
                                >
                                    <DatePicker
                                        suffixIcon={<CalendarOutlined/>}
                                        format="DD.MM.YYYY"
                                        placeholder="15.03.1995"
                                        style={{width: "100%"}}
                                        size="large"
                                        maxDate={dayjs()}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item name="login" label="Логин">
                                    <Input disabled prefix={<UserOutlined/>} size="large"/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item style={{marginBottom: 0}}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isUpdateUserLoading}
                                icon={<SaveOutlined/>}
                                size="large"
                                block
                            >
                                Сохранить изменения
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Карточка смены пароля */}
                <Card
                    title={<Title level={4}><LockOutlined/> Смена пароля</Title>}
                    bordered={false}
                    style={{borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)"}}
                >
                    <Form form={passwordForm} layout="vertical" onFinish={onFinishPasswordForm}>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="password"
                                    label="Новый пароль"
                                    rules={[
                                        {required: true, message: "Введите новый пароль"},
                                        {min: 8, message: "Пароль должен быть не менее 8 символов"},
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined/>} placeholder="••••••••" size="large"/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="repeat_password"
                                    label="Повторите пароль"
                                    dependencies={["password"]}
                                    rules={[
                                        {required: true, message: "Повторите пароль"},
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue("password") === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("Пароли не совпадают"));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined/>} placeholder="••••••••" size="large"/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item style={{marginBottom: 0}}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined/>}
                                size="large"
                                block
                            >
                                Изменить пароль
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default ProfilePage;