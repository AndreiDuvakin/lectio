import React, { useRef, useEffect } from "react";
import {
  Card,
  Input,
  Avatar,
  Badge,
  Typography,
  Space,
  Button,
  Tag,
  Empty,
  Upload,
  Drawer,
  Row,
  Col,
  Collapse,
  List,
  Select,
  Divider,
} from "antd";
import {
  SendOutlined,
  PaperClipOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  MessageOutlined,
  InfoCircleOutlined,
  FileOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import useChatPage from "./useChatPage.js";

const { TextArea } = Input;
const { Title, Text } = Typography;

const ChatPage = () => {
  const {
    selectedChat,
    messages,
    messageText,
    setMessageText,
    searchQuery,
    setSearchQuery,
    selectedCourse,
    setSelectedCourse,
    selectedGroup,
    setSelectedGroup,
    selectedTopic,
    setSelectedTopic,
    courses,
    groups,
    topics,
    currentUser,
    handleSelectChat,
    handleSendMessage,
    handleFileUpload,
    filteredChatList,
    infoDrawerVisible,
    setInfoDrawerVisible,
    chatParticipants,
  } = useChatPage();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ padding: 24, backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#262626" }}>
          <MessageOutlined style={{ marginRight: 12 }} />
          Мессенджер
        </Title>
      </div>

      <Row gutter={0}>
        {/* Левая колонка — список чатов */}
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            style={{
              height: "calc(100vh - 180px)",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            styles={{ 
              body: { 
                padding: 0, 
                height: "100%",
                display: "flex", 
                flexDirection: "column" 
              } 
            }}
          >
            {/* Поиск и фильтры */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
              <Input
                placeholder="Поиск чатов..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                size="large"
                style={{ marginBottom: 12 }}
              />

              <Collapse 
                bordered={false} 
                ghost 
                items={[
                  {
                    key: "1",
                    label: (
                      <Space size={6}>
                        <FilterOutlined />
                        <Text strong>Фильтры</Text>
                        {(selectedCourse || selectedGroup || selectedTopic) && (
                          <Badge count="•" style={{ backgroundColor: "#1890ff" }} />
                        )}
                      </Space>
                    ),
                    children: (
                      <Space direction="vertical" style={{ width: "100%" }} size="middle">
                        <Select
                          placeholder="Курс"
                          value={selectedCourse}
                          onChange={setSelectedCourse}
                          allowClear
                          style={{ width: "100%" }}
                        >
                          {courses.map((c) => (
                            <Select.Option key={c.id} value={c.id}>
                              {c.name}
                            </Select.Option>
                          ))}
                        </Select>

                        <Select
                          placeholder="Группа"
                          value={selectedGroup}
                          onChange={setSelectedGroup}
                          allowClear
                          style={{ width: "100%" }}
                        >
                          {groups.map((g) => (
                            <Select.Option key={g.id} value={g.id}>
                              {g.name}
                            </Select.Option>
                          ))}
                        </Select>

                        <Select
                          placeholder="Тема"
                          value={selectedTopic}
                          onChange={setSelectedTopic}
                          allowClear
                          style={{ width: "100%" }}
                        >
                          {topics.map((t) => (
                            <Select.Option key={t.id} value={t.id}>
                              {t.name}
                            </Select.Option>
                          ))}
                        </Select>

                        {(selectedCourse || selectedGroup || selectedTopic) && (
                          <Button
                            type="link"
                            size="small"
                            onClick={() => {
                              setSelectedCourse(null);
                              setSelectedGroup(null);
                              setSelectedTopic(null);
                            }}
                          >
                            Сбросить фильтры
                          </Button>
                        )}
                      </Space>
                    ),
                  }
                ]} 
              />
            </div>

            {/* Список чатов */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
              {filteredChatList.length === 0 ? (
                <Empty 
                  description="Чаты не найдены" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ marginTop: 60 }} 
                />
              ) : (
                filteredChatList.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    style={{
                      padding: "14px 20px",
                      borderBottom: "1px solid #f0f0f0",
                      background: selectedChat?.id === chat.id ? "#e6f7ff" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedChat?.id !== chat.id) e.currentTarget.style.background = "#f9f9f9";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedChat?.id !== chat.id) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <Badge count={chat.unreadCount} size="small">
                        <Avatar
                          size={44}
                          icon={chat.type === "group" ? <TeamOutlined /> : <UserOutlined />}
                          style={{
                            backgroundColor: chat.type === "group" ? "#52c41a" : "#1890ff",
                            flexShrink: 0
                          }}
                        />
                      </Badge>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: 500, 
                          fontSize: 15, 
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {chat.name}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#8c8c8c",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: 6
                          }}
                        >
                          {chat.lastMessage || "Нет сообщений"}
                        </div>
                        <Space size={4} wrap style={{ marginTop: 6 }}>
                          {chat.course && <Tag color="blue" style={{ fontSize: 11, margin: 0 }}>{chat.course}</Tag>}
                          {chat.group && <Tag color="green" style={{ fontSize: 11, margin: 0 }}>{chat.group}</Tag>}
                          {chat.topic && <Tag color="orange" style={{ fontSize: 11, margin: 0 }}>{chat.topic}</Tag>}
                        </Space>
                      </div>
                      <div style={{ 
                        fontSize: 11, 
                        color: "#8c8c8c", 
                        flexShrink: 0,
                        marginLeft: 8
                      }}>
                        {new Date(chat.lastActivity).toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </Col>

        {/* Правая колонка — чат */}
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          {selectedChat ? (
            <Card
              style={{
                height: "calc(100vh - 180px)",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              styles={{ 
                body: { 
                  padding: 0, 
                  height: "100%",
                  display: "flex", 
                  flexDirection: "column" 
                } 
              }}
            >
              {/* Шапка чата */}
              <div style={{ 
                padding: "16px 24px", 
                borderBottom: "1px solid #f0f0f0",
                flexShrink: 0 
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                    <Avatar
                      size={48}
                      icon={selectedChat.type === "group" ? <TeamOutlined /> : <UserOutlined />}
                      style={{
                        backgroundColor: selectedChat.type === "group" ? "#52c41a" : "#1890ff",
                        flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Title level={4} style={{ 
                        margin: 0, 
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {selectedChat.name}
                      </Title>
                      <Space size={6} wrap style={{ marginTop: 4 }}>
                        {selectedChat.course && <Tag color="blue" style={{ fontSize: 11 }}>{selectedChat.course}</Tag>}
                        {selectedChat.group && <Tag color="green" style={{ fontSize: 11 }}>{selectedChat.group}</Tag>}
                        {selectedChat.topic && <Tag color="orange" style={{ fontSize: 11 }}>{selectedChat.topic}</Tag>}
                      </Space>
                    </div>
                  </div>
                  <Button 
                    icon={<InfoCircleOutlined />} 
                    onClick={() => setInfoDrawerVisible(true)}
                    style={{ flexShrink: 0 }}
                  >
                    Инфо
                  </Button>
                </div>
              </div>

              {/* Сообщения */}
              <div style={{ 
                flex: 1, 
                overflowY: "auto", 
                overflowX: "hidden",
                padding: "24px", 
                background: "#f8f9fa" 
              }}>
                {messages.length === 0 ? (
                  <Empty 
                    description="Нет сообщений" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          marginBottom: 20,
                          display: "flex",
                          justifyContent: isOwn ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            display: "flex",
                            gap: 12,
                            flexDirection: isOwn ? "row-reverse" : "row",
                          }}
                        >
                          {!isOwn && (
                            <Avatar 
                              style={{ 
                                backgroundColor: "#1890ff", 
                                flexShrink: 0 
                              }}
                            >
                              {msg.senderName[0].toUpperCase()}
                            </Avatar>
                          )}
                          <div style={{ minWidth: 0 }}>
                            {!isOwn && (
                              <Text 
                                strong 
                                style={{ 
                                  fontSize: 13, 
                                  display: "block", 
                                  marginBottom: 4 
                                }}
                              >
                                {msg.senderName}
                              </Text>
                            )}
                            <div
                              style={{
                                background: isOwn ? "#1890ff" : "#fff",
                                color: isOwn ? "#fff" : "#000",
                                padding: "10px 16px",
                                borderRadius: 18,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                                border: isOwn ? "none" : "1px solid #f0f0f0",
                                wordBreak: "break-word",
                              }}
                            >
                              {msg.text}
                              {msg.attachment && (
                                <div style={{ marginTop: 8 }}>
                                  <Tag 
                                    icon={<FileOutlined />} 
                                    color={isOwn ? "default" : "blue"}
                                    style={{
                                      background: isOwn ? "rgba(255,255,255,0.2)" : undefined,
                                      borderColor: isOwn ? "rgba(255,255,255,0.3)" : undefined,
                                      color: isOwn ? "#fff" : undefined
                                    }}
                                  >
                                    {msg.attachment}
                                  </Tag>
                                </div>
                              )}
                            </div>
                            <Text 
                              type="secondary" 
                              style={{ 
                                fontSize: 11, 
                                marginTop: 4, 
                                display: "block",
                                textAlign: isOwn ? "right" : "left"
                              }}
                            >
                              {msg.timestamp}
                            </Text>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Поле ввода */}
              <div style={{ 
                padding: "16px 24px", 
                borderTop: "1px solid #f0f0f0",
                flexShrink: 0 
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <Upload 
                    beforeUpload={handleFileUpload} 
                    showUploadList={false}
                  >
                    <Button 
                      icon={<PaperClipOutlined />} 
                      size="large"
                      style={{ flexShrink: 0 }}
                    />
                  </Upload>
                  <TextArea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Напишите сообщение..."
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    style={{ 
                      resize: "none",
                      flex: 1 
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    size="large"
                    style={{ flexShrink: 0 }}
                  >
                    Отправить
                  </Button>
                </div>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: 12, 
                    marginTop: 8, 
                    display: "block" 
                  }}
                >
                  Enter — отправить • Shift+Enter — новая строка
                </Text>
              </div>
            </Card>
          ) : (
            <Card
              style={{
                height: "calc(100vh - 180px)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Empty 
                description="Выберите чат, чтобы начать общение" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </Col>
      </Row>

      {/* Drawer — информация о чате */}
      <Drawer
        title="Информация о чате"
        placement="right"
        open={infoDrawerVisible}
        onClose={() => setInfoDrawerVisible(false)}
        width={400}
      >
        {selectedChat && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Text type="secondary">Название</Text>
              <Title level={5} style={{ margin: "4px 0 0" }}>
                {selectedChat.name}
              </Title>
            </div>
            <div>
              <Text type="secondary">Тип</Text>
              <br />
              <Tag 
                color={selectedChat.type === "group" ? "green" : "blue"}
                style={{ marginTop: 4 }}
              >
                {selectedChat.type === "group" ? "Групповой" : "Личный"}
              </Tag>
            </div>
            {selectedChat.course && (
              <div>
                <Text type="secondary">Курс</Text>
                <br />
                <Tag color="blue" style={{ marginTop: 4 }}>
                  {selectedChat.course}
                </Tag>
              </div>
            )}
            {selectedChat.group && (
              <div>
                <Text type="secondary">Группа</Text>
                <br />
                <Tag color="green" style={{ marginTop: 4 }}>
                  {selectedChat.group}
                </Tag>
              </div>
            )}
            {selectedChat.topic && (
              <div>
                <Text type="secondary">Тема</Text>
                <br />
                <Tag color="orange" style={{ marginTop: 4 }}>
                  {selectedChat.topic}
                </Tag>
              </div>
            )}
            <Divider />
            <div>
              <Text strong>Участники ({chatParticipants.length})</Text>
              <List
                style={{ marginTop: 12 }}
                dataSource={chatParticipants}
                renderItem={(p) => (
                  <List.Item style={{ padding: "12px 0" }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: "#1890ff" }}>
                          {p.name[0]}
                        </Avatar>
                      }
                      title={p.name}
                      description={
                        <Tag color={p.role === "teacher" ? "purple" : "default"}>
                          {p.role === "teacher" ? "Преподаватель" : "Студент"}
                        </Tag>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default ChatPage;