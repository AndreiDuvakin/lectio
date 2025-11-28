import useCreateCourseModalForm from "./useCreateCourseModalForm.js";
import {Button, Col, Form, Input, Modal, Result, Row, Select} from "antd";
import TextArea from "antd/es/input/TextArea.js";
import LoadingIndicator from "../../../../Widgets/LoadingIndicator/LoadingIndicator.jsx";


const CreateCourseModal = () => {
    const {
        openCreateCourseModal,
        handleCancel,
        form,
        isLoadinging,
        isError,
        teachers,
        students
    } = useCreateCourseModalForm();

    if (isLoadinging) {
        return (
            <LoadingIndicator/>
        );
    }

    if (isError) {
        return (
            <Result status="500" title="500" subTitle="Произошла ошибка при загрузке данных пользователя"/>
        );
    }

    return (
        <Modal
            title={"Создание курса"}
            open={openCreateCourseModal}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoadinging}
                    // onClick={handleOk}
                >
                    Создать
                </Button>,
            ]}
            width={800}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="Название курса"
                    rules={[{required: true, message: "Введите название"}]}
                >
                    <Input size="large" placeholder="Введение в Python"/>
                </Form.Item>

                <Form.Item name="description" label="Описание">
                    <TextArea rows={4} placeholder="Курс для начинающих..."/>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="teacher_ids" label="Преподаватели">
                            <Select
                                mode="multiple"
                                placeholder="Выберите преподавателей"
                                loading={isLoadinging}
                            >
                                {teachers.map((teacher) => (
                                    <Select.Option key={teacher.id}
                                                   value={teacher.id}>{teacher.last_name} {teacher.first_name} - {teacher.login}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="student_ids" label="Студенты">
                            <Select
                                mode="multiple"
                                placeholder="Выберите студентов"
                                loading={isLoadinging}
                            >
                                {students.map((student) => (
                                    <Select.Option key={student.id}
                                                   value={student.id}>{student.last_name} {student.first_name} - {student.login}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default CreateCourseModal;