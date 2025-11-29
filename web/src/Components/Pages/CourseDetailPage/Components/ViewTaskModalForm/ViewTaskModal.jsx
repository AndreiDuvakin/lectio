import {Avatar, Button, Col, Divider, Modal, Popconfirm, Row, Space, Spin, Typography} from "antd";
import {CloseOutlined, UserOutlined} from "@ant-design/icons";
import useViewTaskModal from "./useTaskLessonModal.js";


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
        downloadingFiles
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

            <div style={{textAlign: "right"}}>
                <Button onClick={handleClose}>
                    Закрыть
                </Button>
            </div>
        </Modal>
    );
};

export default ViewTaskModal;