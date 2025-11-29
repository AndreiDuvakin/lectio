import useUpdateLessonModalForm from "./useUpdateLessonModalForm.js";
import {Button, Divider, Form, Input, InputNumber, Modal, Popconfirm, Row, Spin, Upload} from "antd";
import JoditEditor from "jodit-react";
import LoadingIndicator from "../../../../Widgets/LoadingIndicator/LoadingIndicator.jsx";
import {UploadOutlined} from "@ant-design/icons";

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
        isFilesLoading,
        downloadFile,
        files,
        downloadingFiles,
        deletingFiles,
        deleteFile,
        draftFiles,
        handleAddFile,
        handleRemoveFile,
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

                {isFilesLoading ? (
                    <Spin/>
                ) : files.length > 0 ? (
                    files.map((file) => (
                        <Row key={file.id} align="middle" justify="space-between">
                            <span>{file.filename || "Не указан"}</span>
                            <div>
                                <Button
                                    onClick={() => downloadFile(file.id, file.filename)}
                                    loading={downloadingFiles[file.id] || false}
                                    disabled={downloadingFiles[file.id] || deletingFiles[file.id] || false}
                                    type={"dashed"}
                                    style={{marginRight: 8}}
                                >
                                    {downloadingFiles[file.id] ? "Загрузка..." : "Скачать"}
                                </Button>
                                <Popconfirm
                                    title={"Вы уверены, что хотите удалить файл?"}
                                    onConfirm={() => deleteFile(file.id, file.filename)}
                                >
                                    <Button
                                        loading={deletingFiles[file.id] || false}
                                        disabled={deletingFiles[file.id] || downloadingFiles[file.id] || false}
                                        type={"dashed"}
                                        danger
                                    >
                                        {deletingFiles[file.id] ? "Удаление..." : "Удалить"}
                                    </Button>
                                </Popconfirm>
                            </div>
                            <Divider/>
                        </Row>
                    ))
                ) : (
                    <p>Файлы отсутствуют</p>
                )}
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

export default UpdateLessonModalForm;