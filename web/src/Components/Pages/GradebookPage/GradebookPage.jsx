import {useParams, useNavigate} from "react-router-dom";
import {
    Table,
    Card,
    Typography,
    Spin,
    Button,
    Space,
    Tag,
    Tooltip,
    Empty,
    Result,
    Avatar, Statistic,
} from "antd";
import {
    ArrowLeftOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    MinusOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    useGetCourseByIdQuery,
    useGetGradebookByCourseQuery,
} from "../../../Api/coursesApi.js";
import {useGetAuthenticatedUserDataQuery} from "../../../Api/usersApi.js";

const {Title, Text} = Typography;

const GradebookPage = () => {
    const navigate = useNavigate();
    const {courseId} = useParams();

    // Данные текущего пользователя
    const {data: userData, isLoading: userLoading} = useGetAuthenticatedUserDataQuery();

    const {
        data: courseData,
        isLoading: courseLoading,
    } = useGetCourseByIdQuery(courseId);

    const {
        data: gradebook,
        isLoading: gradebookLoading,
        isError: gradebookError,
    } = useGetGradebookByCourseQuery(courseId, {pollingInterval: 15000});

    const isLoading = courseLoading || gradebookLoading || userLoading;

    if (isLoading) {
        return (
            <div style={{padding: 80, textAlign: "center"}}>
                <Spin size="large" tip="Загружается журнал..."/>
            </div>
        );
    }

    if (gradebookError || !gradebook) {
        return <Empty description="Не удалось загрузить журнал"/>;
    }

    const isStudent = userData?.role?.title === "student";
    const currentStudentId = userData?.id;

    // Если студент — фильтруем только его данные
    const visibleStudents = isStudent
        ? gradebook.students.filter((s) => s.student_id === currentStudentId)
        : gradebook.students;

    // Если студент, но его нет в курсе — покажем сообщение
    if (isStudent && visibleStudents.length === 0) {
        return (
            <Card style={{margin: 24}}>
                <Result
                    status="info"
                    title="Вы не записаны на этот курс"
                    subTitle="Чтобы видеть свою успеваемость, нужно быть зачисленным на курс."
                    extra={
                        <Button type="primary" onClick={() => navigate(-1)}>
                            Назад
                        </Button>
                    }
                />
            </Card>
        );
    }

    // === Колонки ===
    const baseColumns = [
        {
            title: "№",
            width: 60,
            fixed: "left",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Студент",
            fixed: "left",
            width: isStudent ? 300 : 240,
            render: (record) => {
                const fullName = `${record.last_name} ${record.first_name} ${
                    record.patronymic ? record.patronymic[0] + "." : ""
                }`;

                if (isStudent) {
                    return (
                        <Space>
                            <Avatar icon={<UserOutlined/>} style={{backgroundColor: "#1890ff"}}/>
                            <div>
                                <Text strong>{fullName}</Text>
                                <br/>
                                <Text type="secondary">Ваша успеваемость</Text>
                            </div>
                        </Space>
                    );
                }
                return <Text strong>{fullName}</Text>;
            },
        },
    ];

    const lessonColumns = gradebook.lessons.map((lesson) => ({
        title: (
            <Tooltip title={lesson.title}>
                <div style={{fontSize: 12}}>Л{lesson.number}</div>
            </Tooltip>
        ),
        width: 70,
        align: "center",
        render: (record) =>
            record.read_lesson_ids.includes(lesson.id) ? (
                <CheckCircleFilled style={{color: "#52c41a", fontSize: 18}}/>
            ) : (
                <ClockCircleOutlined style={{color: "#d9d9d9", fontSize: 18}}/>
            ),
    }));

    const taskColumns = gradebook.tasks.map((task) => ({
        title: (
            <Tooltip title={task.title}>
                <div style={{fontSize: 12}}>З{task.number}</div>
            </Tooltip>
        ),
        width: 90,
        align: "center",
        render: (record) => {
            const grade = record.task_grades[task.id];
            if (grade === null || grade === undefined) {
                return <MinusOutlined style={{color: "#bfbfbf"}}/>;
            }
            const color = grade >= 90 ? "green" : grade >= 70 ? "orange" : "red";
            return <Tag color={color}>{grade}</Tag>;
        },
    }));

    const columns = [...baseColumns, ...lessonColumns, ...taskColumns];

    const dataSource = visibleStudents.map((student) => ({
        key: student.student_id,
        ...student,
    }));

    return (
        <div style={{padding: 24, backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
            <Card style={{marginBottom: 24}}>
                <Space direction="vertical" size="middle" style={{width: "100%"}}>
                    <Button icon={<ArrowLeftOutlined/>} onClick={() => navigate(-1)} type="text">
                        Назад
                    </Button>

                    <Title level={2} style={{margin: 0}}>
                        {isStudent ? "Моя успеваемость" : "Журнал успеваемости"} — {courseData?.title}
                    </Title>

                    {!isStudent && (
                        <Space size="large">
                            <Statistic title="Студентов" value={gradebook.students.length}/>
                            <Statistic title="Лекций" value={gradebook.lessons.length}/>
                            <Statistic title="Заданий" value={gradebook.tasks.length}/>
                        </Space>
                    )}
                </Space>
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{x: isStudent ? 1000 : 1400}}
                    pagination={isStudent ? false : {pageSize: 15, showSizeChanger: true}}
                    bordered
                    size="middle"
                />
            </Card>

            {!isStudent && (
                <Card style={{marginTop: 24}}>
                    <Text>Легенда: </Text>
                    <Tag color="green">90–100</Tag>
                    <Tag color="orange">70–89</Tag>
                    <Tag color="red">0–69</Tag>
                    <Text strong style={{marginLeft: 16}}>
                        <CheckCircleFilled style={{color: "#52c41a"}}/> — прочитано
                    </Text>
                    <Text strong>
                        <ClockCircleOutlined style={{color: "#d9d9d9"}}/> — не прочитано
                    </Text>
                    <Text strong>
                        <MinusOutlined/> — не сдано / не оценено
                    </Text>
                </Card>
            )}
        </div>
    );
};

export default GradebookPage;