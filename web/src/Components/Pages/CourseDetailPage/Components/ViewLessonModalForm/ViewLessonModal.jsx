import useViewLessonModal from "./useViewLessonModal.js";
import {Avatar, Button, Col, Divider, Modal, Space, Typography} from "antd";
import {CloseOutlined, UserOutlined} from "@ant-design/icons";


const {Title, Text, Paragraph} = Typography;

const ViewLessonModal = () => {
    const {
        selectedLessonToView,
        modalIsOpen,
        handleClose,
    } = useViewLessonModal();

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
                        {selectedLessonToView?.title}
                    </Title>
                    <Avatar
                        size="small"
                        icon={<UserOutlined/>}
                        style={{backgroundColor: "#1890ff"}}
                    >
                        {selectedLessonToView?.creator?.first_name?.[0] || "У"}
                    </Avatar>
                    <Text type="secondary">
                        Создал: <strong>{selectedLessonToView?.creator?.first_name} {selectedLessonToView?.creator?.last_name}</strong>
                        {selectedLessonToView?.creator?.patronymic && ` ${selectedLessonToView?.creator.patronymic}`}
                    </Text>
                </Col>

            </Space>

            {selectedLessonToView?.description && (
                <>
                    <Title level={4} style={{margin: "16px 0 8px"}}>
                        Описание
                    </Title>
                    <Paragraph type="secondary" style={{fontSize: 16, marginBottom: 24}}>
                        {selectedLessonToView?.description}
                    </Paragraph>
                    <Divider style={{margin: "24px 0"}}/>
                </>
            )}

            {selectedLessonToView?.text ? (
                <div
                    className="lesson-content"
                    dangerouslySetInnerHTML={{__html: selectedLessonToView?.text}}
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

            <div style={{textAlign: "right"}}>
                <Button onClick={handleClose}>
                    Закрыть
                </Button>
            </div>
        </Modal>
    );
};

export default ViewLessonModal;