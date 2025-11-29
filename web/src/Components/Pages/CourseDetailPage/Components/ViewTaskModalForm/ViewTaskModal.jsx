import {
    Avatar,
    Button,
    Col, Collapse,
    Divider,
    Empty, Flex,
    Form,
    Modal,
    Popconfirm,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
    Upload
} from "antd";
import {
    CloseOutlined, DeleteOutlined,
    DownloadOutlined,
    FileOutlined,
    PlusOutlined,
    UploadOutlined,
    UserOutlined
} from "@ant-design/icons";
import useViewTaskModal from "./useTaskLessonModal.js";
import {ROLES} from "../../../../../Core/constants.js";
import JoditEditor from "jodit-react";

const {Panel} = Collapse;
const {Title, Text, Paragraph} = Typography;

const ViewTaskModal = () => {
    const {
        selectedTaskToView,
        modalIsOpen,
        handleClose,
        currentTaskFiles,
        isCurrentTaskFilesLoading,
        isCurrentTaskFilesError,
        downloadFile,
        downloadingFiles,
        currentUser,
        mySolutions,
        editorRef,
        joditConfig,
        handleAddFile,
        handleRemoveFile,
        handleOk,
        draftFiles,
        handleDeleSolution
    } = useViewTaskModal();

    return (
        <Modal
            open={modalIsOpen}
            onCancel={handleClose}
            footer={null}
            width={1000}
            closeIcon={<CloseOutlined style={{fontSize: 20}}/>}
            title={null}
            centered
            destroyOnHidden
        >
            <Space align="start" style={{marginBottom: 16}}>
                <Col>
                    <Title level={2} style={{margin: 0, flex: 1}}>
                        {selectedTaskToView?.title}
                    </Title>
                    <Avatar
                        size="small"
                        icon={<UserOutlined/>}
                        style={{backgroundColor: "#1890ff"}}
                    >
                        {selectedTaskToView?.creator?.first_name?.[0] || "У"}
                    </Avatar>
                    <Text type="secondary">
                        Создал: <strong>{selectedTaskToView?.creator?.first_name} {selectedTaskToView?.creator?.last_name}</strong>
                        {selectedTaskToView?.creator?.patronymic && ` ${selectedTaskToView?.creator.patronymic}`}
                    </Text>
                </Col>

            </Space>

            {selectedTaskToView?.description && (
                <>
                    <Title level={4} style={{margin: "16px 0 8px"}}>
                        Описание
                    </Title>
                    <Paragraph type="secondary" style={{fontSize: 16, marginBottom: 24}}>
                        {selectedTaskToView?.description}
                    </Paragraph>
                    <Divider style={{margin: "24px 0"}}/>
                </>
            )}

            {selectedTaskToView?.text ? (
                <div
                    className="Task-content"
                    dangerouslySetInnerHTML={{__html: selectedTaskToView?.text}}
                    style={{
                        fontSize: "16px",
                        lineHeight: "1.7",
                        color: "#333",
                    }}
                />
            ) : (
                <Paragraph italic type="secondary">
                    Текстовый материал отсутствует
                </Paragraph>
            )}

            <Divider/>
            <Title level={3}>Прикрепленные файлы</Title>
            {isCurrentTaskFilesLoading ? (
                <Spin/>
            ) : currentTaskFiles.length > 0 ? (
                currentTaskFiles.map((file) => (
                    <Row key={file.id} align="middle" justify="space-between">
                        <span>{file.filename || "Не указан"}</span>
                        <div>
                            <Button
                                onClick={() => downloadFile(file.id, file.filename)}
                                loading={downloadingFiles[file.id] || false}
                                disabled={downloadingFiles[file.id] || false}
                                type={"dashed"}
                                style={{marginRight: 8}}
                            >
                                {downloadingFiles[file.id] ? "Загрузка..." : "Скачать"}
                            </Button>
                        </div>
                        <Divider/>
                    </Row>
                ))
            ) : (
                <p>Файлы отсутствуют</p>
            )}

            {currentUser?.role?.title === ROLES.STUDENT ? (
                <Col>
                    <Title level={3}>Ваши решения</Title>
                    {mySolutions.length > 0 ? (
                        <Collapse accordion>
                            {mySolutions.map((solution) => (
                                <Panel
                                    key={solution.id}
                                    header={
                                            <Flex justify="space-between" align="center">
                                                <Text strong>Решение
                                                    от {new Date(solution.created_at).toLocaleString("ru-RU")}</Text>
                                                {solution.assessment !== null ? (
                                                    <Tag
                                                        color={solution.assessment >= 80 ? "green" : solution.assessment >= 60 ? "orange" : "red"}>
                                                        Оценка: {solution.assessment} / 100
                                                    </Tag>
                                                ) : (
                                                    <Tag color="blue">На проверке</Tag>
                                                )}

                                                <Popconfirm
                                                    title={`Удалить ответ на задание?`}
                                                    description="Это действие нельзя отменить"
                                                    onConfirm={(e) => {
                                                        handleDeleSolution(solution.id)
                                                    }}
                                                    okText="Удалить"
                                                    cancelText="Отмена"
                                                >
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined/>}
                                                    />
                                                </Popconfirm>
                                            </Flex>
                                    }
                                    extra={
                                        solution.assessment !== null && (
                                            <Tag color="purple">
                                                Проверено: {solution.assessment_autor?.first_name} {solution.assessment_autor?.last_name}
                                            </Tag>
                                        )
                                    }
                                >
                                    <div style={{marginBottom: 16}}>
                                        <Text strong>Ответ:</Text>
                                        <Paragraph
                                            style={{
                                                background: "#f9f9f9",
                                                padding: 12,
                                                borderRadius: 8,
                                                margin: "8px 0",
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {solution.answer_text}
                                        </Paragraph>
                                    </div>

                                    {solution.files && solution.files.length > 0 ? (
                                        <div>
                                            <Text strong>Прикреплённые файлы:</Text>
                                            <div style={{
                                                marginTop: 8,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 8
                                            }}>
                                                {solution.files.map((file) => (
                                                    <Button
                                                        key={file.id}
                                                        type="dashed"
                                                        icon={<FileOutlined/>}
                                                        style={{textAlign: "left"}}
                                                        onClick={() => downloadFile(file.id, file.filename)}
                                                        loading={downloadingFiles[file.id]}
                                                    >
                  <span style={{marginLeft: 8}}>
                    {file.filename} ({(file.file_size / 1024 / 1024).toFixed(2)} МБ)
                  </span>
                                                        <DownloadOutlined style={{marginLeft: 8, color: "#1890ff"}}/>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Text type="secondary">Файлы не прикреплены</Text>
                                    )}
                                </Panel>
                            ))}
                        </Collapse>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Решений пока нет"
                        />
                    )}
                    <Title level={3}>Добавить решение</Title>
                    <div style={{border: "1px solid #d9d9d9", borderRadius: 8, overflow: "hidden"}}>
                        <JoditEditor
                            ref={editorRef}
                            config={joditConfig}
                        />
                    </div>
                    <Divider/>
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
                    <Divider/>
                    <Button type="primary" onClick={handleOk}>
                        Сохранить решение
                    </Button>
                </Col>
            ) : [ROLES.ADMIN, ROLES.TEACHER].includes(currentUser?.role?.title) && (
                <></>
            )}

            <div style={{textAlign: "right"}}>
                <Button onClick={handleClose}>
                    Закрыть
                </Button>
            </div>
        </Modal>
    );
};

export default ViewTaskModal;