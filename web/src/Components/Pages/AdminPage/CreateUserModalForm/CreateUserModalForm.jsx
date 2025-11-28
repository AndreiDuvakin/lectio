import {Button, DatePicker, Form, Input, Modal, Select, Tooltip, Typography} from "antd";
import useCreateUserModalForm from "./useCreateUserModalForm.js";
import {CalendarOutlined, InfoCircleOutlined} from "@ant-design/icons";
import dayjs from "dayjs";


const CreateUserModalForm = () => {
    const {
        modalVisible,
        handleCancel,
        handleFinish,
        form,
        roles,
        isLoading,
        isError,
    } = useCreateUserModalForm();

    return (
        <Modal
            title="Создать пользователя"
            open={modalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
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
                    <Input/>
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
                <Tooltip
                    title="Пароль должен содержать не менее 8 символов, включая хотя бы одну букву и одну цифру и один специальный символ"
                >
                    <Typography.Title level={3} style={{width: 30}}>
                        <InfoCircleOutlined/>
                    </Typography.Title>
                </Tooltip>
                <Form.Item label="Пароль" name="password" rules={[{required: true, message: "Введите пароль"}]}>
                    <Input.Password/>
                </Form.Item>
                <Form.Item label="Подтвердите пароль" name="repeat_password"
                           rules={[{required: true, message: "Подтвердите пароль"}, ({getFieldValue}) => ({
                               validator(_, value) {
                                   if (!value || getFieldValue("password") === value) {
                                       return Promise.resolve();
                                   }
                                   return Promise.reject(new Error("Пароли не совпадают"));
                               },
                           }),]}>
                    <Input.Password/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Создать
                    </Button>
                    <Button onClick={handleCancel} style={{marginLeft: 8}}>
                        Отмена
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default CreateUserModalForm;