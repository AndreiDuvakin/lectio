import {Button, Col, Flex, Form, Input, Typography} from "antd";
import useLoginPage from "./useLoginPage.js";

const {Title} = Typography;

const LoginPage = () => {
    const {
        pageContainerStyle,
        onFinish
    } = useLoginPage();

    return (
        <Flex vertical align={"center"} justify={"center"}>
            <Col style={pageContainerStyle}>
                <Title>Аутентификация</Title>
                <Form name={"login"} onFinish={onFinish}>
                    <Form.Item
                        name="login"
                        rules={[{required: true, message: "Введите логин"}]}
                    >
                        <Input
                            placeholder={"Логин"}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                    >
                        <Input.Password placeholder={"Пароль"}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Col>

        </Flex>
    )
};

export default LoginPage;