import {Button, Col, Form, Input, Modal, Result, Row, Select, Spin} from "antd";
import useCreateCourseModalForm from "./useCreateCourseModalForm.js";
import LoadingIndicator from "../../../../Widgets/LoadingIndicator/LoadingIndicator.jsx";

const {Option} = Select;
const {TextArea} = Input;

const CreateCourseModal = () => {
    const {
        openCreateCourseModal,
        handleCancel,
        handleOk,
        form,
        teachers,
        students,
        isLoading,
        isError,
    } = useCreateCourseModalForm();

    if (isError) {
        return <Modal visible={openCreateCourseModal} footer={null}>
            <Result status="500" title="Ошибка загрузки"/>
        </Modal>;
    }

    const filterOption = (input, option) =>
        option.children.toString().toLowerCase().includes(input.toLowerCase());

    return (
        <Modal
            title="Создание курса"
            open={openCreateCourseModal}
            onCancel={handleCancel}
            width={900}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    onClick={handleOk}
                >
                    Создать курс
                </Button>,
            ]}
        >
            {isLoading ? (
                <LoadingIndicator/>
            ) : (
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Название курса"
                        rules={[{required: true, message: "Введите название курса"}]}
                    >
                        <Input size="large" placeholder="Введение в React"/>
                    </Form.Item>

                    <Form.Item name="description" label="Описание (необязательно)">
                        <TextArea rows={4} placeholder="Курс для начинающих разработчиков..."/>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="teacher_ids" label="Преподаватели">
                                <Select
                                    mode="multiple"
                                    placeholder="Начните вводить ФИО или логин..."
                                    loading={isLoading}
                                    showSearch={{filterOption: filterOption}}
                                    notFoundContent="Преподаватели не найдены"
                                >
                                    {teachers.map((teacher) => (
                                        <Option key={teacher.id} value={teacher.id}>
                                            {teacher.last_name} {teacher.first_name} ({teacher.login})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="student_ids" label="Студенты">
                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder="Начните вводить ФИО или логин..."
                                    loading={isLoading}
                                    filterOption={filterOption}
                                    optionFilterProp="children"
                                    notFoundContent="Студенты не найдены"
                                >
                                    {students.map((student) => (
                                        <Option key={student.id} value={student.id}>
                                            {student.last_name} {student.first_name} ({student.login})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )}
        </Modal>
    );
};

export default CreateCourseModal;