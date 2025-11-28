import useCourseDetailPage from "./useCourseDetailPage.js";
import {
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    FloatButton,
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
    BookOutlined,
    DeleteOutlined,
    EditOutlined,
    FormOutlined,
    PlusOutlined
} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {ROLES} from "../../../Core/constants.js";
import CONFIG from "../../../Core/сonfig.js";
import LoadingIndicator from "../../Widgets/LoadingIndicator/LoadingIndicator.jsx";
import CreateLessonModalForm from "./Components/CreateLessonModalForm/CreateLessonModalForm.jsx";
import ViewLessonModal from "./Components/ViewLessonModalForm/ViewLessonModal.jsx";


const {Title, Text} = Typography;

const CourseDetailPage = () => {
    const navigate = useNavigate();
    const {courseId} = useParams();
    const {
        isTeacherOrAdmin,
        lessonsData,
        userData,
        courseData,
        isLoading,
        isError,
        handleCreateLesson,
        handleOpenLesson,
        handleEditLesson,
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
                    style={{ margin: "60px 0" }}
                >
                    {isTeacherOrAdmin && (
                        <Button type="primary" size="large" onClick={handleCreateLesson}>
                            Добавить первую лекцию
                        </Button>
                    )}
                </Empty>
            ) : (
                <Row gutter={[24, 24]}>
                    {lessonsData.map((lesson, index) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={lesson.id}>
                            <Card
                                hoverable
                                style={{ height: "100%", cursor: "pointer" }}
                                onClick={() => handleOpenLesson(lesson)}
                                title={
                                    <Space>
                                        <Text strong>{lesson.number}. {lesson.title}</Text>
                                        {lesson.text && lesson.text.length > 100 && (
                                            <Tag color="blue">Есть текст</Tag>
                                        )}
                                    </Space>
                                }
                                extra={
                                    isTeacherOrAdmin && (
                                        <Space onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditLesson(lesson);
                                                }}
                                            />
                                            <Popconfirm
                                                title="Удалить лекцию?"
                                                description="Это действие нельзя отменить"
                                                // onConfirm={(e) => {
                                                //     e?.stopPropagation();
                                                //     handleDeleteLesson(lesson.id);
                                                // }}
                                                okText="Удалить"
                                                cancelText="Отмена"
                                            >
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </Popconfirm>
                                        </Space>
                                    )
                                }
                            >
                                <div style={{ marginBottom: 16 }}>
                                    {lesson.description ? (
                                        <Text type="secondary">{lesson.description}</Text>
                                    ) : (
                                        <Text type="secondary" italic>Описание отсутствует</Text>
                                    )}
                                </div>

                                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                    <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
                                        {userData?.first_name?.[0] || "У"}
                                    </Avatar>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Создал: {lesson.creator?.first_name} {lesson.creator?.last_name}
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <CreateLessonModalForm
                courseId={courseId}
            />
            <ViewLessonModal/>
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
                    />
                </FloatButton.Group>
            )}
        </div>
    )
};

export default CourseDetailPage;