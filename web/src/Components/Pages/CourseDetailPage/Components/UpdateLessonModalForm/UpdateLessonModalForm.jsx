import useUpdateLessonModalForm from "./useUpdateLessonModalForm.js";
import {Button, Form, Input, InputNumber, Modal, Upload} from "antd";
import JoditEditor from "jodit-react";
import LoadingIndicator from "../../../../Widgets/LoadingIndicator/LoadingIndicator.jsx";

const {TextArea} = Input;

const UpdateLessonModalForm = ({courseId}) => {
    const {
        isModalOpen,
        handleCancel,
        handleOk,
        form,
        joditConfig,
        editorRef,
        isLoading,
        initialContent,
        currentLesson,
    } = useUpdateLessonModalForm({courseId});

    if (isLoading) {
        return <Modal>
            <LoadingIndicator/>
        </Modal>
    }

    return (
        <Modal
            title="Редактирование лекции"
            open={isModalOpen}
            onCancel={handleCancel}
            width={1000}
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
                    Сохранить изменения
                </Button>,
            ]}
            maskClosable={false}
            keyboard={false}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="Название лекции"
                    rules={[{ required: true, message: "Введите название лекции" }]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item name="description" label="Краткое описание">
                    <TextArea rows={2} placeholder="О чём эта лекция..." />
                </Form.Item>

                <Form.Item name="number" label="Порядковый номер">
                    <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Содержание лекции">
                    <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, overflow: "hidden" }}>
                        <JoditEditor
                            ref={editorRef}
                            config={joditConfig}
                        />
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateLessonModalForm;