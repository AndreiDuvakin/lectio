import {Button, Col, Flex, Form, Input, Select, Typography} from "antd";
import {UserOutlined, MailOutlined, LockOutlined} from "@ant-design/icons";
import useRegisterPage from "./useRegisterPage.js";

const {Title, Text} = Typography;

const RegisterPage = () => {
    const {
        pageContainerStyle,
        onFinish
    } = useRegisterPage();

    return (
        <Flex vertical align={"center"} justify={"center"}>
            <Col style={pageContainerStyle}>
                <Title>Регистрация</Title>
                <Text type="secondary" style={{display: "block", marginBottom: 24}}>
                    Создайте новый аккаунт для работы с платформой
                </Text>
                
                <Form 
                    name={"register"} 
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Роль"
                        name="role"
                        rules={[{required: true, message: "Выберите роль"}]}
                    >
                        <Select 
                            placeholder="Выберите роль"
                            size="large"
                        >
                            <Select.Option value="student">Студент</Select.Option>
                            <Select.Option value="teacher">Преподаватель</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Имя"
                        name="firstName"
                        rules={[{required: true, message: "Введите имя"}]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Иван"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Фамилия"
                        name="lastName"
                        rules={[{required: true, message: "Введите фамилию"}]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Иванов"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {required: true, message: "Введите email"},
                            {type: "email", message: "Введите корректный email"}
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="example@mail.com"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Логин"
                        name="login"
                        rules={[{required: true, message: "Введите логин"}]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Логин"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {required: true, message: "Введите пароль"},
                            {min: 6, message: "Пароль должен содержать минимум 6 символов"}
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />}
                            placeholder="Пароль"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Подтверждение пароля"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {required: true, message: "Подтвердите пароль"},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />}
                            placeholder="Подтвердите пароль"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item style={{marginBottom: 8}}>
                        <Button type="primary" htmlType="submit" block size="large">
                            Зарегистрироваться
                        </Button>
                    </Form.Item>

                    <Form.Item style={{marginBottom: 0, textAlign: "center"}}>
                        <Text type="secondary">
                            Уже есть аккаунт? <a href="/login">Войти</a>
                        </Text>
                    </Form.Item>
                </Form>
            </Col>
        </Flex>
    );
};

export default RegisterPage;