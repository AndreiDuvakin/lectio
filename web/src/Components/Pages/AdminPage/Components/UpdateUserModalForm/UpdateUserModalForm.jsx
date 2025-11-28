import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Typography,
    Avatar,
    Divider, Result,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    CalendarOutlined,
    SaveOutlined,
    CrownOutlined,
    TagOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import LoadingIndicator from "../../../../Widgets/LoadingIndicator/LoadingIndicator.jsx";
import useUpdateUserModalForm from "./useUpdateUserModalForm.js";

const {Title, Text} = Typography;

const UpdateUserModalForm = () => {
    const {
        modalVisible,
        handleCancel,
        handleFinish,
        userForm,
        passwordForm,
        roles,
        statusesData,
        isLoading,
        isError,
        isLoadingUpdate,
        handlePasswordFinish,
    } = useUpdateUserModalForm();

    if (isLoading) return <LoadingIndicator/>;
    if (isError) {
        return (
            <Result status="500" title="500" subTitle="Ошибка загрузки данных пользователя"/>
        );
    }

    return (
        <Modal
            open={modalVisible}
            onCancel={handleCancel}
            footer={null}
            width={720}
            title={
                <Space>
                    <Avatar size={36} icon={<UserOutlined/>} style={{backgroundColor: "#1890ff"}}/>
                    <div>
                        <Title level={4} style={{margin: 0}}>
                            Редактирование пользователя
                        </Title>
                        <Text type="secondary">Изменение профиля и прав доступа</Text>
                    </div>
                </Space>
            }
            closeIcon={null}
        >
            <Row gutter={24}>
                <Col span={24}>
                    <Card
                        title={<Title level={5}><UserOutlined/> Основная информация</Title>}
                        style={{marginBottom: 24, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)"}}
                    >
                        <Form form={userForm} layout="vertical" onFinish={handleFinish}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="last_name"
                                        label="Фамилия"
                                        rules={[{required: true, message: "Введите фамилию"}]}
                                    >
                                        <Input prefix={<UserOutlined/>} size="large" placeholder="Иванов"/>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="first_name"
                                        label="Имя"
                                        rules={[{required: true, message: "Введите имя"}]}
                                    >
                                        <Input prefix={<UserOutlined/>} size="large" placeholder="Иван"/>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item name="patronymic" label="Отчество">
                                        <Input prefix={<UserOutlined/>} size="large" placeholder="Иванович"/>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            {required: true, message: "Введите email"},
                                            {type: "email", message: "Некорректный email"},
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined/>} size="large" placeholder="ivan@example.com"/>
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

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="role_id"
                                        label={<><CrownOutlined/> Роль</>}
                                        rules={[{required: true, message: "Выберите роль"}]}
                                    >
                                        <Select size="large" placeholder="Выберите роль">
                                            {roles.map((role) => (
                                                <Select.Option key={role.id} value={role.id}>
                                                    <Space>
                                                        <CrownOutlined style={{color: "#722ed1"}}/>
                                                        {role.title}
                                                    </Space>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="status_id"
                                        label={<><TagOutlined/> Статус</>}
                                        rules={[{required: true, message: "Выберите статус"}]}
                                    >
                                        <Select size="large" placeholder="Выберите статус">
                                            {statusesData.map((status) => (
                                                <Select.Option key={status.id} value={status.id}>
                                                    <Space>
                                                        <div
                                                            style={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: "50%",
                                                                backgroundColor: status.title === "Активен" ? "#52c41a" : "#ff4d4f",
                                                                display: "inline-block",
                                                                marginRight: 8,
                                                            }}
                                                        />
                                                        {status.title}
                                                    </Space>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{marginBottom: 0, textAlign: "right"}}>
                                <Space>
                                    <Button onClick={handleCancel}>Отмена</Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoadingUpdate}
                                        icon={<SaveOutlined/>}
                                        size="large"
                                    >
                                        Сохранить изменения
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card
                        title={<Title level={5}><LockOutlined/> Смена пароля</Title>}
                        style={{borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)"}}
                    >
                        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordFinish}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="password"
                                        label="Новый пароль"
                                        rules={[
                                            {required: true, message: "Введите пароль"},
                                            {min: 8, message: "Минимум 8 символов"},
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined/>} size="large" placeholder="••••••••"/>
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
                                        <Input.Password prefix={<LockOutlined/>} size="large" placeholder="••••••••"/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{marginBottom: 0, textAlign: "right"}}>
                                <Space>
                                    <Button onClick={handleCancel}>Отмена</Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoadingUpdate}
                                        icon={<LockOutlined/>}
                                        size="large"
                                    >
                                        Изменить пароль
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Modal>
    );
};

export default UpdateUserModalForm;