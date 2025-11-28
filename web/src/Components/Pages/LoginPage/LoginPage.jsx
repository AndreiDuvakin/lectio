import { Button, Col, Flex, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";
import useLoginPage from "./useLoginPage.js";

const { Title } = Typography;

const LoginPage = () => {
    const {
        pageContainerStyle,
        onFinish,
        isLoading
    } = useLoginPage();

    return (
        <Flex 
            vertical 
            align="center" 
            justify="center" 
            style={{ 
                minHeight: '100vh', 
                padding: '20px',
                backgroundColor: '#f0f2f5'
            }}
            gap={24}
        >
            <Col style={pageContainerStyle}>
                <Title style={{ textAlign: 'center', marginBottom: 24 }}>Аутентификация</Title>
                <Form name="login" onFinish={onFinish}>
                    <Form.Item
                        name="login"
                        rules={[{ required: true, message: "Введите логин" }]}
                    >
                        <Input placeholder="Логин" size="large" />
                    </Form.Item>
                    <Form.Item name="password">
                        <Input.Password placeholder="Пароль" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            size="large"
                            loading={isLoading}
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            
            <Flex align="center" justify="center" style={{ width: '100%' }}>
                <span style={{ color: '#8c8c8c', marginRight: 8 }}>Нет аккаунта?</span>
                <Link to="/register">
                    <Button type="link" style={{ padding: 0, fontSize: 14, fontWeight: 500 }}>
                        Зарегистрироваться
                    </Button>
                </Link>
            </Flex>
        </Flex>
    );
};

export default LoginPage;
