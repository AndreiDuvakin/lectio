import useCourseDetailPage from "./useCourseDetailPage.js";
import {Button, Col, FloatButton, Result, Row, Tooltip, Typography} from "antd";
import {ArrowLeftOutlined, BookOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {ROLES} from "../../../Core/constants.js";
import CONFIG from "../../../Core/сonfig.js";
import LoadingIndicator from "../../Widgets/LoadingIndicator/LoadingIndicator.jsx";
import CreateLessonModalForm from "./Components/CreateLessonModalForm/CreateLessonModalForm.jsx";


const {Title} = Typography;

const CourseDetailPage = () => {
    const navigate = useNavigate();
    const {courseId} = useParams();
    const {
        userData,
        courseData,
        isLoading,
        isError,
        handleCreateLesson,
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

            <CreateLessonModalForm/>
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