import useCourseDetailPage from "./useCourseDetailPage.js";
import {
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    FloatButton, Grid,
    Popconfirm,
    Result,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography
} from "antd";
import {
    ArrowLeftOutlined,
    BookOutlined, CheckCircleFilled, ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    FormOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
    PlusOutlined, TableOutlined
} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {ROLES} from "../../../Core/constants.js";
import CONFIG from "../../../Core/сonfig.js";
import LoadingIndicator from "../../Widgets/LoadingIndicator/LoadingIndicator.jsx";
import CreateLessonModalForm from "./Components/CreateLessonModalForm/CreateLessonModalForm.jsx";
import ViewLessonModal from "./Components/ViewLessonModalForm/ViewLessonModal.jsx";
import UpdateLessonModalForm from "./Components/UpdateLessonModalForm/UpdateLessonModalForm.jsx";
import CreateTaskModalForm from "./Components/CreateTaskModalForm/CreateTaskModalForm.jsx";
import UpdateTaskModalForm from "./Components/UpdateTaskModalForm/UpdateTaskModalForm.jsx";
import ViewTaskModal from "./Components/ViewTaskModalForm/ViewTaskModal.jsx";
import {useState} from "react";


const {Title, Text} = Typography;
const {useBreakpoint} = Grid;

const CourseDetailPage = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const [hovered, setHovered] = useState(false);

    const {courseId} = useParams();
    const {
        tasksData,
        isTeacherOrAdmin,
        lessonsData,
        userData,
        courseData,
        isLoading,
        isError,
        handleCreateLesson,
        handleOpenLesson,
        handleEditLesson,
        handleDeleteLesson,
        handleCreateTask,
        handleOpenTask,
        handleEditTask,
        handleDeleteTask,
        listReadLessonsIds,
    } = useCourseDetailPage(courseId);

    if (isLoading) {
        return <LoadingIndicator/>;
    }

    if (isError) {
        return <Result status="500" title="500" subTitle="Произошла ошибка при загрузке курса"/>;
    }

    return (
        <div style={{minHeight: "100vh"}}>
            <Row justify="space-between" align="middle" style={{marginBottom: 24}}>
                <Col>
                    <Button
                        icon={<ArrowLeftOutlined/>}
                        onClick={() => navigate(-1)}
                        style={{marginBottom: 16}}
                    >
                        Назад
                    </Button>
                    <Title level={2} style={{margin: 0}}>
                        <BookOutlined/> Курс - {courseData.title}
                    </Title>
                </Col>
            </Row>

            {lessonsData.length === 0 ? (
                <Empty
                    description="Пока нет лекций"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{margin: "60px 0"}}
                >
                    {isTeacherOrAdmin && (
                        <Button type="primary" size="large" onClick={handleCreateLesson}>
                            Добавить первую лекцию
                        </Button>
                    )}
                </Empty>
            ) : (
                <Row gutter={[24, 24]}>
                    {[...lessonsData, ...tasksData]
                        .sort((a, b) => a.number - b.number)
                        .map((item) => {
                            const isLesson = item.__typename === "Lesson";
                            const isTask = item.__typename === "Task";

                            return (
                                <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
                                    <Card
                                        hoverable
                                        style={{height: "100%", cursor: "pointer"}}
                                        onClick={() =>
                                            isLesson ? handleOpenLesson(item) : handleOpenTask(item)
                                        }
                                        title={
                                            <Space>
                                                <Text strong>
                                                    {item.title}
                                                </Text>
                                            </Space>
                                        }
                                        extra={
                                            isTeacherOrAdmin && (
                                                <Space onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        type="text"
                                                        icon={<EditOutlined/>}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            isLesson
                                                                ? handleEditLesson(item)
                                                                : handleEditTask(item);
                                                        }}
                                                    />
                                                    <Popconfirm
                                                        title={`Удалить ${isLesson ? "лекцию" : "задание"}?`}
                                                        description="Это действие нельзя отменить"
                                                        onConfirm={(e) => {
                                                            e?.stopPropagation();
                                                            isLesson
                                                                ? handleDeleteLesson(item.id)
                                                                : handleDeleteTask(item.id);
                                                        }}
                                                        okText="Удалить"
                                                        cancelText="Отмена"
                                                    >
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<DeleteOutlined/>}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </Popconfirm>
                                                </Space>
                                            )
                                        }
                                    >
                                        <div style={{marginBottom: 16}}>
                                            <Space vertical>
                                                {isTask && (
                                                    <Tag color="orange" size="small">
                                                        Задание
                                                    </Tag>
                                                )}
                                                {isLesson && (
                                                    <Tag color="blue" size="small">
                                                        Лекция
                                                    </Tag>
                                                )}
                                                {item.description ? (
                                                    <Text type="secondary">
                                                        {item.description.slice(0, 100)}
                                                        {item.description.length > 100 && "..."}
                                                    </Text>
                                                ) : (
                                                    <Text type="secondary" italic>
                                                        Описание отсутствует
                                                    </Text>
                                                )}
                                            </Space>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <Text>
                                                {isLesson ? "Лекционный материал" : "Задание"}
                                            </Text>

                                            {isLesson && (
                                                listReadLessonsIds.includes(item.id) ? (
                                                    <Space style={{color: "#52c41a", fontWeight: 500}}>
                                                        <CheckCircleFilled style={{fontSize: 18}}/>
                                                        <span>Пройдено</span>
                                                    </Space>
                                                ) : (
                                                    <Space style={{color: "#999"}}>
                                                        <ClockCircleOutlined style={{fontSize: 16}}/>
                                                        <span>Не прочитано</span>
                                                    </Space>
                                                )
                                            )}
                                        </div>

                                        <div
                                            style={{
                                                marginTop: 16,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >
                                            <Avatar
                                                size="small"
                                                style={{backgroundColor: "#1890ff"}}
                                            >
                                                {item.creator?.first_name?.[0] || "У"}
                                            </Avatar>
                                            <Text type="secondary" style={{fontSize: 12}}>
                                                Создал: {item.creator?.first_name}{" "}
                                                {item.creator?.last_name}
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                </Row>
            )}

            <CreateLessonModalForm
                courseId={courseId}
            />
            <ViewLessonModal
                courseId={courseId}
            />
            <UpdateLessonModalForm/>

            <CreateTaskModalForm
                courseId={courseId}
            />
            <ViewTaskModal
                courseId={courseId}
            />
            <div
                style={{
                    position: "fixed",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    transition: "right 0.3s ease",
                    zIndex: 1000,
                    display: screens.xs ? "none" : "block",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Button
                    type="primary"
                    onClick={() => {
                        navigate(`/courses/${courseId}/gradebook/`)
                    }}
                    icon={<TableOutlined/>}
                    style={{
                        width: hovered ? 250 : 50,
                        padding: hovered ? "0 20px" : "0",
                        overflow: "hidden",
                        textAlign: "left",
                        transition: "width 0.3s ease, padding 0.3s ease",
                        borderRadius: "4px 0 0 4px",
                    }}
                >
                    {hovered && (
                        <>Журнал успеваемости</>
                    )}
                </Button>
            </div>
            <UpdateTaskModalForm/>
            {[CONFIG.ROOT_ROLE_NAME, ROLES.TEACHER].includes(userData.role.title) && (
                <FloatButton.Group
                    placement={"left"}
                    trigger="hover"
                    type="primary"
                    icon={<PlusOutlined/>}
                    tooltip="Добавить элемент курса"
                >
                    <FloatButton
                        icon={<PlusOutlined/>}
                        tooltip="Лекционный материал"
                        onClick={handleCreateLesson}
                    />
                    <FloatButton
                        icon={<FormOutlined/>}
                        tooltip="Задание"
                        onClick={handleCreateTask}
                    />
                </FloatButton.Group>

            )
            }
        </div>
    )
};

export default CourseDetailPage;