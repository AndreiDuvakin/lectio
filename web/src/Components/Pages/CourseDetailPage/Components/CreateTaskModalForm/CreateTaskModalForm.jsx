import useCreateTaskModalForm from "./useCreateTaskModalForm.js";
import {Button, Form, Input, InputNumber, Modal, Upload} from "antd";
import JoditEditor from "jodit-react";
import {UploadOutlined} from "@ant-design/icons";

const {TextArea} = Input;

const CreateTaskModalForm = ({courseId}) => {
    const {
        isModalOpen,
        handleCancel,
        handleOk,
        form,
        joditConfig,
        editorRef,
        isLoading,
        handleAddFile,
        handleRemoveFile,
        draftFiles,
    } = useCreateTaskModalForm({courseId});

    return (
        <Modal
            title="Создание задания"
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
                    Создать задание
                </Button>,
            ]}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" preserve={false}>
                <Form.Item
                    name="title"
                    label="Название задания"
                    rules={[{required: true, message: "Введите название задания"}]}
                >
                    <Input size="large"/>
                </Form.Item>

                <Form.Item name="description" label="Краткое описание заачи">
                    <TextArea rows={2} placeholder="Что нужно будет сделать..."/>
                </Form.Item>

                <Form.Item name="number" label="Порядковый номер" initialValue={1}>
                    <InputNumber min={1} style={{width: "100%"}}/>
                </Form.Item>

                <Form.Item label="Содержание задания">
                    <div style={{border: "1px solid #d9d9d9", borderRadius: 6}}>
                        <JoditEditor
                            ref={editorRef}
                            config={joditConfig}
                        />
                    </div>
                </Form.Item>

                <Form.Item name="files" label="Прикрепить файлы">
                    <Upload
                        fileList={draftFiles}
                        beforeUpload={(file) => {
                            handleAddFile(file);
                            return false;
                        }}
                        onRemove={(file) => handleRemoveFile(file)}
                        multiple
                    >
                        <Button icon={<UploadOutlined/>}>Выбрать файлы</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default CreateTaskModalForm;