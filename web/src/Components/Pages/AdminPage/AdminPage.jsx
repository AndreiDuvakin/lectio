import {Button, Col, Flex, FloatButton, Input, Result, Row, Table, Tooltip, Typography} from "antd";
import {ControlOutlined, PlusOutlined} from "@ant-design/icons";
import useAdminPage from "./useAdminPage.js";
import LoadingIndicator from "../../Widgets/LoadingIndicator/LoadingIndicator.jsx";
import CreateUserModalForm from "./Components/CreateUserModalForm/CreateUserModalForm.jsx";
import UpdateUserModalForm from "./Components/UpdateUserModalForm/UpdateUserModalForm.jsx";

const {Title} = Typography;

const AdminPage = () => {
    const {
        handleSelectUserToEdit,
        rolesData,
        filteredUsers,
        handleSearch,
        isLoading,
        isError,
        openCreateModal,
        currentUser,
    } = useAdminPage();

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Фамилия",
            dataIndex: "last_name",
            key: "lastName",
            sorter: (a, b) => a.last_name.localeCompare(b.last_name),
        },
        {
            title: "Имя",
            dataIndex: "first_name",
            key: "firstName",
            sorter: (a, b) => a.first_name.localeCompare(b.first_name),
        },
        {
            title: "Отчество",
            dataIndex: "patronymic",
            key: "patronymic",
        },
        {
            title: "Роль",
            dataIndex: ["role", "title"],
            key: "role",
            filters: rolesData.map(role => ({text: role.title, value: role.title})),
            onFilter: (value, record) => record.role.title === value,
        },
        {
            title: "Статус",
            dataIndex: ["status", "title"],
            key: "status",
            filters: rolesData.map(status => ({text: status.title, value: status.title})),
            onFilter: (value, record) => record.status.title === value,
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                (currentUser.id !== record.id ? (<Button type="link" onClick={() => handleSelectUserToEdit(record)}>
                    Редактировать
                </Button>) : null)
            ),
        },
    ];

    if (isError) {
        return <Result status="500" title="500" subTitle="Произошла ошибка при загрузке данных"/>;
    }

    if (isLoading) {
        return <LoadingIndicator/>;
    }

    return (
        <Row>
            <Col style={{width: '100%'}}>
                <Title level={1}>
                    <ControlOutlined/> Панель администратора
                </Title>
                <Flex vertical>
                    <Input
                        placeholder="Введите фамилию, имя или отчество"
                        style={{marginBottom: 12, width: "100%"}}
                        allowClear
                        onChange={handleSearch}
                    />
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        rowKey="id"
                        pagination={{pageSize: 10}}
                    />
                </Flex>
                <Tooltip title="Добавить пользователя">
                    <FloatButton onClick={openCreateModal} icon={<PlusOutlined/>} type={"primary"}/>
                </Tooltip>
            </Col>

            <CreateUserModalForm/>
            <UpdateUserModalForm/>
        </Row>
    )
};

export default AdminPage;