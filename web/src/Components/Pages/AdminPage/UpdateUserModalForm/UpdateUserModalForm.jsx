import {Button, DatePicker, Form, Input, Modal, Result, Select, Tooltip, Typography} from "antd";
import useUpdateUserModalForm from "./useUpdateUserModalForm.js";
import {CalendarOutlined, InfoCircleOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import LoadingIndicator from "../../../Widgets/LoadingIndicator/LoadingIndicator.jsx";


const UpdateUserModalForm = () => {
    const {
        modalVisible,
        handleCancel,
        handleFinish,
        userForm,
        passwordForm,
        roles,
        isLoading,
        isError,
        isLoadingUpdate,
        isErrorUpdate,
        handlePasswordFinish,
        statusesData,
    } = useUpdateUserModalForm();

    if (isLoading) {
        return <LoadingIndicator/>
    }

    if (isError) {
        return <Result status="500" title="500" subTitle="Произошла ошибка при загрузке данных пользователя"/>
    }

    return (
        <Modal
            title="Изменить пользователя"
            open={modalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={userForm}
                onFinish={handleFinish}
                layout="vertical"
            >
                <Form.Item label="Фамилия" name="last_name" rules={[{required: true, message: "Введите фамилию"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="Имя" name="first_name" rules={[{required: true, message: "Введите имя"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="Отчество" name="patronymic">
                    <Input/>
                </Form.Item>
                <Form.Item label="Логин" name="login" rules={[{required: true, message: "Введите логин"}]}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{required: true, message: "Введите email", type: "email"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="birthdate"
                    label="Дата рождения"
                    rules={[{required: true, message: "Введите дату рождения"}]}
                >
                    <DatePicker
                        suffixIcon={<CalendarOutlined/>}
                        format="DD.MM.YYYY"
                        style={{width: "100%"}}
                        size="large"
                        maxDate={dayjs()}
                    />
                </Form.Item>
                <Form.Item
                    name="role_id"
                    label="Роль"
                    rules={[{required: true, message: "Выберите роль"}]}
                >
                    <Select>
                        {roles.map((role) => (
                            <Select.Option key={role.id} value={role.id}>
                                {role.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="status_id"
                    label="Статус"
                    rules={[{required: true, message: "Выберите статус"}]}
                >
                    <Select>
                        {statusesData.map((status) => (
                            <Select.Option key={status.id} value={status.id}>
                                {status.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoadingUpdate || isLoading}>
                        Сохранить изменения
                    </Button>
                </Form.Item>
            </Form>
            <Form form={passwordForm} onFinish={handlePasswordFinish}>
                <Typography.Title level={4}>Изменение пароля</Typography.Title>
                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[{required: true, message: "Введите пароль"}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    name="repeat_password"
                    label="Подтверждение пароля"
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
                    <Input.Password/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoadingUpdate || isLoading}>
                        Изменить пароль
                    </Button>
                    <Button onClick={handleCancel} style={{marginLeft: 8}}>
                        Отмена
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default UpdateUserModalForm;