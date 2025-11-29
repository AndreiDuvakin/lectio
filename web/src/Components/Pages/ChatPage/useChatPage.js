import { useState, useMemo, useEffect } from "react";
import { message } from "antd";

const useChatPage = () => {
    // Состояния
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [infoDrawerVisible, setInfoDrawerVisible] = useState(false);

    // Текущий пользователь (заглушка)
    const currentUser = {
        id: 1,
        name: "Иван Иванов",
        role: "teacher"
    };

    // Заглушка - курсы
    const courses = [
        {id: 1, name: "Основы программирования"},
        {id: 2, name: "Веб-разработка"},
        {id: 3, name: "Базы данных"},
        {id: 4, name: "Алгоритмы и структуры данных"},
    ];

    // Заглушка - группы
    const groups = [
        {id: 1, name: "ПИ-201"},
        {id: 2, name: "ПИ-202"},
        {id: 3, name: "ПИ-203"},
        {id: 4, name: "ПИ-301"},
    ];

    // Заглушка - темы
    const topics = [
        {id: 1, name: "Домашние задания"},
        {id: 2, name: "Лекции"},
        {id: 3, name: "Проекты"},
        {id: 4, name: "Вопросы по курсу"},
        {id: 5, name: "Организационные вопросы"},
    ];

    // Заглушка - список чатов
    const chatList = [
        {
            id: 1,
            name: "ПИ-201 - Основы программирования",
            type: "group",
            course: "Основы программирования",
            courseId: 1,
            group: "ПИ-201",
            groupId: 1,
            topic: "Домашние задания",
            topicId: 1,
            lastMessage: "Не забудьте сдать ДЗ до конца недели",
            unreadCount: 3,
            lastActivity: new Date().toISOString()
        },
        {
            id: 2,
            name: "Веб-разработка - Вопросы по курсу",
            type: "group",
            course: "Веб-разработка",
            courseId: 2,
            group: "ПИ-202",
            groupId: 2,
            topic: "Вопросы по курсу",
            topicId: 4,
            lastMessage: "Как правильно настроить webpack?",
            unreadCount: 0,
            lastActivity: new Date().toISOString()
        },
        {
            id: 3,
            name: "Мария Петрова",
            type: "personal",
            course: null,
            courseId: null,
            group: null,
            groupId: null,
            topic: null,
            topicId: null,
            lastMessage: "Здравствуйте, у меня вопрос по заданию...",
            unreadCount: 1,
            lastActivity: new Date().toISOString()
        },
        {
            id: 4,
            name: "ПИ-203 - Базы данных",
            type: "group",
            course: "Базы данных",
            courseId: 3,
            group: "ПИ-203",
            groupId: 3,
            topic: "Лекции",
            topicId: 2,
            lastMessage: "Материалы по нормализации загружены",
            unreadCount: 0,
            lastActivity: new Date().toISOString()
        },
        {
            id: 5,
            name: "Проектная работа - ПИ-201",
            type: "group",
            course: "Веб-разработка",
            courseId: 2,
            group: "ПИ-201",
            groupId: 1,
            topic: "Проекты",
            topicId: 3,
            lastMessage: "Когда защита проектов?",
            unreadCount: 5,
            lastActivity: new Date().toISOString()
        },
    ];

    // Заглушка - сообщения выбранного чата
    const [messages, setMessages] = useState([
        {
            id: 1,
            senderId: 2,
            senderName: "Мария Петрова",
            text: "Здравствуйте! У меня вопрос по второму домашнему заданию.",
            timestamp: "10:30",
            attachment: null
        },
        {
            id: 2,
            senderId: 1,
            senderName: "Иван Иванов",
            text: "Здравствуйте, Мария! Конечно, задавайте вопрос.",
            timestamp: "10:32",
            attachment: null
        },
        {
            id: 3,
            senderId: 2,
            senderName: "Мария Петрова",
            text: "Не могу понять, как правильно реализовать рекурсию в третьей задаче.",
            timestamp: "10:33",
            attachment: null
        },
        {
            id: 4,
            senderId: 1,
            senderName: "Иван Иванов",
            text: "Давайте разберем по шагам. Сначала определите базовый случай, когда рекурсия должна остановиться.",
            timestamp: "10:35",
            attachment: null
        },
        {
            id: 5,
            senderId: 2,
            senderName: "Мария Петрова",
            text: "Вот мой код, подскажите, что не так?",
            timestamp: "10:37",
            attachment: "code.py"
        },
    ]);

    // Заглушка - участники чата
    const chatParticipants = [
        {
            id: 1,
            name: "Иван Иванов",
            role: "teacher"
        },
        {
            id: 2,
            name: "Мария Петрова",
            role: "student"
        },
        {
            id: 3,
            name: "Алексей Сидоров",
            role: "student"
        },
        {
            id: 4,
            name: "Екатерина Смирнова",
            role: "student"
        },
    ];

    // Фильтрация списка чатов
    const filteredChatList = useMemo(() => {
        return chatList.filter(chat => {
            if (searchQuery && !chat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (selectedCourse && chat.courseId !== selectedCourse) {
                return false;
            }
            if (selectedGroup && chat.groupId !== selectedGroup) {
                return false;
            }
            if (selectedTopic && chat.topicId !== selectedTopic) {
                return false;
            }
            return true;
        });
    }, [searchQuery, selectedCourse, selectedGroup, selectedTopic, chatList]);

    // Выбор чата
    const handleSelectChat = (chatId) => {
        const chat = chatList.find(c => c.id === chatId);
        setSelectedChat(chat);
    };

    // Автоматический выбор первого чата при загрузке
    useEffect(() => {
        if (chatList.length > 0 && !selectedChat) {
            handleSelectChat(chatList[0].id);
        }
    }, [chatList, selectedChat]);

    // Отправка сообщения
    const handleSendMessage = () => {
        if (!messageText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: messageText,
            timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}),
            attachment: null
        };

        setMessages([...messages, newMessage]);
        setMessageText("");
        message.success("Сообщение отправлено");
    };

    // Загрузка файла
    const handleFileUpload = (file) => {
        const newMessage = {
            id: messages.length + 1,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: "Отправлен файл:",
            timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}),
            attachment: file.name
        };

        setMessages([...messages, newMessage]);
        message.success(`Файл ${file.name} отправлен`);
    };

    return {
        chatList,
        selectedChat,
        messages,
        messageText,
        setMessageText,
        selectedCourse,
        setSelectedCourse,
        selectedGroup,
        setSelectedGroup,
        selectedTopic,
        setSelectedTopic,
        searchQuery,
        setSearchQuery,
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
        chatParticipants
    };
};

export default useChatPage;