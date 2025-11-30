import {
    Avatar,
    Button,
    Col, Collapse,
    Divider,
    Empty, Flex,
    Form, Input, InputNumber, List,
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
        downloadTasksFile,
        downloadingFiles,
        currentUser,
        mySolutions,
        editorRef,
        joditConfig,
        handleAddFile,
        handleRemoveFile,
        handleOk,
        draftFiles,
        handleDeleSolution,
        allSolutions,
        onAssessmentFinish,
        assessmentForm,
        onCommentSubmit,
        commentForm,
        setComment,
        comment,
        downloadSolutionFile,
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
                                onClick={() => downloadTasksFile(file.id, file.filename)}
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
                                        <div
                                            style={{
                                                background: "#f9f9f9",
                                                padding: 16,
                                                borderRadius: 8,
                                                margin: "12px 0",
                                                border: "1px solid #f0f0f0",
                                                minHeight: 60,
                                            }}
                                            dangerouslySetInnerHTML={{__html: solution.answer_text || "<em>Текст ответа отсутствует</em>"}}
                                        />
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
                                                        onClick={() => downloadSolutionFile(file.id, file.filename)}
                                                        loading={downloadingFiles[file.id]}
                                                    >
                                                          <span style={{marginLeft: 8}}>
                                                            {file.filename}
                                                          </span>
                                                        <DownloadOutlined style={{marginLeft: 8, color: "#1890ff"}}/>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Text type="secondary">Файлы не прикреплены</Text>
                                    )}
                                    <div style={{marginTop: 32}}>
                                        <Title level={4}>Комментарии к решению</Title>

                                        <div
                                            style={{
                                                maxHeight: 400,
                                                overflowY: "auto",
                                                padding: "8px 0",
                                                border: "1px solid #f0f0f0",
                                                borderRadius: 8,
                                                background: "#fafafa",
                                            }}
                                        >
                                            {solution.solution_comments && solution.solution_comments.length > 0 ? (
                                                <List
                                                    dataSource={solution.solution_comments}
                                                    renderItem={(comment) => (
                                                        <List.Item style={{
                                                            padding: "12px 16px",
                                                            borderBottom: "1px solid #f0f0f0"
                                                        }}>
                                                            <List.Item.Meta
                                                                avatar={
                                                                    <Avatar style={{backgroundColor: "#1890ff"}}>
                                                                        {comment.comment_autor.first_name[0]}
                                                                        {comment.comment_autor.last_name[0]}
                                                                    </Avatar>
                                                                }
                                                                title={
                                                                    <Space>
                                                                        <Text strong>
                                                                            {comment.comment_autor.first_name} {comment.comment_autor.last_name}
                                                                        </Text>
                                                                        {comment.comment_autor.role?.title === "teacher" && (
                                                                            <Tag color="gold"
                                                                                 size="small">Преподаватель</Tag>
                                                                        )}
                                                                    </Space>
                                                                }
                                                                description={
                                                                    <Text type="secondary" style={{fontSize: 12}}>
                                                                        {new Date(comment.created_at || Date.now()).toLocaleString("ru-RU")}
                                                                    </Text>
                                                                }
                                                            />
                                                            <div
                                                                style={{
                                                                    marginTop: 8,
                                                                    paddingLeft: 56,
                                                                    whiteSpace: "pre-wrap",
                                                                    wordBreak: "break-word",
                                                                }}
                                                                dangerouslySetInnerHTML={{__html: comment.comment_text}}
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            ) : (
                                                <Empty
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    description="Пока нет комментариев"
                                                    style={{margin: "20px 0"}}
                                                />
                                            )}
                                        </div>
                                        <Input.TextArea
                                            rows={3}
                                            placeholder="Напишите комментарий к решению..."
                                            allowClear
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            style={{ marginTop: 20, marginBottom: 20}}
                                        />

                                        <Button onClick={() => onCommentSubmit(solution.id)} type="primary"
                                                htmlType="submit">
                                            Отправить комментарий
                                        </Button>
                                    </div>
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
                <Col>
                    <Title level={3}>Присланные решения</Title>
                    {allSolutions.length > 0 ? (
                        <Collapse accordion>
                            {allSolutions.map((solution) => (
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
                                                <Tag color="red">Ждет проверки</Tag>
                                            )}
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
                                        <div
                                            style={{
                                                background: "#f9f9f9",
                                                padding: 16,
                                                borderRadius: 8,
                                                margin: "12px 0",
                                                border: "1px solid #f0f0f0",
                                                minHeight: 60,
                                            }}
                                            dangerouslySetInnerHTML={{__html: solution.answer_text || "<em>Текст ответа отсутствует</em>"}}
                                        />
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
                                                        onClick={() => downloadSolutionFile(file.id, file.filename)}
                                                        loading={downloadingFiles[file.id]}
                                                    >
                  <span style={{marginLeft: 8}}>
                    {file.filename}
                  </span>
                                                        <DownloadOutlined style={{marginLeft: 8, color: "#1890ff"}}/>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Text type="secondary">Файлы не прикреплены</Text>
                                    )}
                                    <Title level={3}>Оценка</Title>
                                    <Form form={assessmentForm} onFinish={() => {
                                        onAssessmentFinish(solution.id)
                                    }}>
                                        <Form.Item
                                            name={"assessment"}
                                            rules={[{required: true, message: "Укажите оценку"}]}
                                        >
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                placeholder={"Выставите балл от 1 до 100"}
                                                style={{
                                                    minWidth: "230px"
                                                }}
                                                defaultValue={solution.assessment || null}
                                                required
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type={"primary"} htmlType={"submit"}>
                                                Выставить оценку
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                    <div style={{marginTop: 32}}>
                                        <Title level={4}>Комментарии к решению</Title>

                                        <div
                                            style={{
                                                maxHeight: 400,
                                                overflowY: "auto",
                                                padding: "8px 0",
                                                border: "1px solid #f0f0f0",
                                                borderRadius: 8,
                                                background: "#fafafa",
                                            }}
                                        >
                                            {solution.solution_comments && solution.solution_comments.length > 0 ? (
                                                <List
                                                    dataSource={solution.solution_comments}
                                                    renderItem={(comment) => (
                                                        <List.Item style={{
                                                            padding: "12px 16px",
                                                            borderBottom: "1px solid #f0f0f0"
                                                        }}>
                                                            <List.Item.Meta
                                                                avatar={
                                                                    <Avatar style={{backgroundColor: "#1890ff"}}>
                                                                        {comment.comment_autor.first_name[0]}
                                                                        {comment.comment_autor.last_name[0]}
                                                                    </Avatar>
                                                                }
                                                                title={
                                                                    <Space>
                                                                        <Text strong>
                                                                            {comment.comment_autor.first_name} {comment.comment_autor.last_name}
                                                                        </Text>
                                                                        {comment.comment_autor.role?.title === "teacher" && (
                                                                            <Tag color="gold"
                                                                                 size="small">Преподаватель</Tag>
                                                                        )}
                                                                    </Space>
                                                                }
                                                                description={
                                                                    <Text type="secondary" style={{fontSize: 12}}>
                                                                        {new Date(comment.created_at || Date.now()).toLocaleString("ru-RU")}
                                                                    </Text>
                                                                }
                                                            />
                                                            <div
                                                                style={{
                                                                    marginTop: 8,
                                                                    paddingLeft: 56,
                                                                    whiteSpace: "pre-wrap",
                                                                    wordBreak: "break-word",
                                                                }}
                                                                dangerouslySetInnerHTML={{__html: comment.comment_text}}
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            ) : (
                                                <Empty
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    description="Пока нет комментариев"
                                                    style={{margin: "20px 0"}}
                                                />
                                            )}
                                        </div>


                                        <Input.TextArea
                                            rows={3}
                                            placeholder="Напишите комментарий к решению..."
                                            allowClear
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            style={{ marginTop: 20, marginBottom: 20}}
                                        />

                                        <Button onClick={() => onCommentSubmit(solution.id)} type="primary"
                                                htmlType="submit">
                                            Отправить комментарий
                                        </Button>
                                    </div>
                                </Panel>
                            ))}
                        </Collapse>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Решений пока нет"
                        />
                    )}
                </Col>
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

export default ViewTaskModal;