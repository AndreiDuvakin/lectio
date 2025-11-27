import useProfilePage from "./useProfilePage.js";
import {Button, Col, DatePicker, Divider, Form, Input, Result, Row, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import LoadingIndicator from "../../Widgets/LoadingIndicator/LoadingIndicator.jsx";

const {Title} = Typography;

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
        onFinishPasswordForm
    } = useProfilePage();

    if (isError) {
        return (
            <Result
                status="error"
                title="Ошибка"
                subTitle="Произошла ошибка при загрузке данных профиля"
            />
        );
    }

    if (isLoading) {
        return <LoadingIndicator/>;
    }

    return (
        <Col>
            <Row>
                <Title>
                    <UserOutlined/> Управление профилем
                </Title>
                <Divider/>

            </Row>
            <Form name={"profile"} form={userForm} onFinish={onFinishProfileForm}>
                <Form.Item
                    name="first_name"
                    rules={[{required: true, message: "Введите имя"}]}
                >
                    <Input placeholder={"Имя"}/>
                </Form.Item>
                <Form.Item
                    name="last_name"
                    rules={[{required: true, message: "Введите фамилию"}]}
                >
                    <Input placeholder={"Фамилия"}/>
                </Form.Item>
                <Form.Item
                    name="patronymic"
                >
                    <Input placeholder={"Отчество"}/>
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{required: true, message: "Введите email"}]}
                >
                    <Input placeholder={"Email"}/>
                </Form.Item>
                <Form.Item
                    name="birthdate"
                    rules={[{required: true, message: "Введите дату рождения"}]}
                >
                    <DatePicker
                        maxDate={dayjs(new Date())}
                        placeholder={"Дата рождения"}
                        format={"DD.MM.YYYY"}
                    />
                </Form.Item>
                <Form.Item
                    name="login"
                    rules={[{required: true, message: "Введите логин"}]}
                >
                    <Input placeholder={"Логин"} disabled/>
                </Form.Item>
                <Form.Item>
                    <Button loading={isUpdateUserLoading} type="primary" htmlType="submit" block>
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
            <Divider/>

            <Title level={3}>Смена пароля</Title>
            <Form name={"password"} form={passwordForm} onFinish={onFinishPasswordForm}>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: "Введите пароль"}]}
                >
                    <Input.Password placeholder={"Пароль"}/>
                </Form.Item>
                <Form.Item
                    name="repeat_password"
                    rules={[{required: true, message: "Введите пароль"}]}
                >
                    <Input.Password placeholder={"Повторите пароль"}/>
                </Form.Item>
                <Form.Item>
                    <Button loading={isLoading} type="primary" htmlType="submit" block>
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Col>
    );
};

export default ProfilePage;