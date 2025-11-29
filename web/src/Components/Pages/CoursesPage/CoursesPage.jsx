import {
    Button,
    Card,
    Col,
    Empty,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
    Avatar, Result, FloatButton, Tooltip, Progress, Divider,
} from "antd";
import {
    PlusOutlined,
    UserOutlined,
    TeamOutlined, BookOutlined,
} from "@ant-design/icons";
import useCoursesPage from "./useCoursesPage.js";
import LoadingIndicator from "../../Widgets/LoadingIndicator/LoadingIndicator.jsx";
import CreateCourseModalForm from "./Components/CreateCourseModalForm/CreateCourseModalForm.jsx";
import UpdateCourseModalForm from "./Components/UpdateCourseModalForm/UpdateCourseModalForm.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import CONFIG from "../../../Core/сonfig.js";

const {Title, Text} = Typography;

const CoursesPage = () => {
    const navigate = useNavigate();
    const {
        courses,
        isLoading,
        isError,
        isAdmin,
        isTeacher,
        openCreateModal,
        openEditModal,
    } = useCoursesPage();


    const [courseProgress, setCourseProgress] = useState({});

    useEffect(() => {
        if (courses.length === 0) return;

        const token = localStorage.getItem("access_token");
        if (!token) return;

        const fetchProgress = async () => {
            const progress = {};
            for (const course of courses) {
                try {
                    const res = await fetch(`${CONFIG.BASE_URL}/users/my-progress/${course.id}/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        progress[course.id] = data; // data — это число, например 87.5
                    }
                } catch (err) {
                    console.error("Progress fetch error for course", course.id);
                }
            }
            setCourseProgress(progress);
        };

        fetchProgress();
    }, [courses]);

    if (isLoading) {
        return (
            <LoadingIndicator/>
        );
    }

    if (isError) {
        return <Result status="500" title="500" subTitle="Произошла ошибка при загрузке курсов"/>
    }

    return (
        <div style={{minHeight: "100vh"}}>
            <Row justify="space-between" align="middle" style={{marginBottom: 24}}>
                <Col>
                    <Title level={2} style={{margin: 0}}>
                        <BookOutlined/> Курсы
                    </Title>
                </Col>
            </Row>

            {courses.length === 0 ? (
                <Empty
                    description="Курсов пока нет"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    {(isAdmin || isTeacher) && (
                        <Button type="primary" onClick={openCreateModal}>
                            Создать первый курс
                        </Button>
                    )}
                </Empty>
            ) : (
                <Row gutter={[24, 24]}>
                    {courses.map((course) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
                            <Card
                                hoverable
                                cover={
                                    <div
                                        style={{
                                            height: 160,
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: 48,
                                        }}
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                        {course.title[0].toUpperCase()}
                                    </div>
                                }
                                actions={
                                    isAdmin || isTeacher
                                        ? [
                                            <Button
                                                type="link"
                                                onClick={() => openEditModal(course)}
                                            >
                                                Редактировать
                                            </Button>,
                                        ]
                                        : []
                                }
                            >
                                <Card.Meta
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                    title={<Title level={4}>{course.title}</Title>}
                                    description={
                                        course.description || <Text type="secondary">Без описания</Text>
                                    }
                                />

                                {course.teachers?.length > 0 && (
                                    <div style={{marginTop: 16}}>
                                        <Text type="secondary">Преподаватели:</Text>
                                        <Avatar.Group max={{count: 3}} style={{marginTop: 8}}>
                                            {course.teachers.map((t) => (
                                                <Avatar key={t.teacher_id} style={{backgroundColor: "#1890ff"}}>
                                                    {t.teacher?.first_name?.[0] || "У"}
                                                </Avatar>
                                            ))}
                                        </Avatar.Group>
                                        <Divider/>
                                        <Text type="secondary">Прогресс:</Text>
                                        {courseProgress[course.id] !== undefined && (
                                            <Progress percent={courseProgress[course.id]} size={[300, 20]}/>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Tooltip title="Создать курс">
                <FloatButton
                    icon={<PlusOutlined/>}
                    onClick={openCreateModal}
                    type="primary"
                />
            </Tooltip>

            <CreateCourseModalForm/>
            <UpdateCourseModalForm/>
        </div>
    );
};

export default CoursesPage;