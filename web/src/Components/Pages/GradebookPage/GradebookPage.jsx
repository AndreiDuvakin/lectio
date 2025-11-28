import { useState, useMemo } from "react";
import { Avatar, Progress, Tag, Tooltip, Space, Button, Table, Card, Row, Col, Statistic, Select, Typography, Input, Modal, Badge } from "antd";
import { UserOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined, FilterOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

const GradebookPage = ({ onLogout }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    groups: [],
    searchText: "",
    progressRange: [0, 100]
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascend'
  });
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  // Заглушки для данных
  const courses = [
    { id: 1, title: "Основы программирования" },
    { id: 2, title: "Веб-разработка" },
    { id: 3, title: "Базы данных" },
    { id: 4, title: "Алгоритмы и структуры данных" },
  ];

  const assignments = [
    { id: 1, name: "ДЗ №1", maxScore: 100 },
    { id: 2, name: "ДЗ №2", maxScore: 100 },
    { id: 3, name: "ДЗ №3", maxScore: 100 },
    { id: 4, name: "Проект", maxScore: 200 },
  ];

  const students = [
    {
      id: 1,
      firstName: "Иван",
      lastName: "Иванов",
      email: "ivanov@mail.com",
      group: "ПИ-201",
      grades: { 1: 85, 2: 92, 3: 78, 4: 180 },
      progress: 85
    },
    {
      id: 2,
      firstName: "Мария",
      lastName: "Петрова",
      email: "petrova@mail.com",
      group: "ПИ-201",
      grades: { 1: 95, 2: 88, 3: 91, 4: 190 },
      progress: 92
    },
    {
      id: 3,
      firstName: "Алексей",
      lastName: "Сидоров",
      email: "sidorov@mail.com",
      group: "ПИ-202",
      grades: { 1: 72, 2: null, 3: 85, 4: null },
      progress: 52
    },
    {
      id: 4,
      firstName: "Екатерина",
      lastName: "Смирнова",
      email: "smirnova@mail.com",
      group: "ПИ-202",
      grades: { 1: 88, 2: 90, 3: 87, 4: 175 },
      progress: 88
    },
    {
      id: 5,
      firstName: "Дмитрий",
      lastName: "Козлов",
      email: "kozlov@mail.com",
      group: "ПИ-203",
      grades: { 1: 65, 2: 70, 3: null, 4: null },
      progress: 45
    },
    {
      id: 6,
      firstName: "Анна",
      lastName: "Волкова",
      email: "volkova@mail.com",
      group: "ПИ-201",
      grades: { 1: 100, 2: 98, 3: 95, 4: 195 },
      progress: 97
    },
    {
      id: 7,
      firstName: "Сергей",
      lastName: "Орлов",
      email: "orlov@mail.com",
      group: "ПИ-203",
      grades: { 1: 80, 2: 85, 3: 82, 4: 170 },
      progress: 79
    },
    {
      id: 8,
      firstName: "Ольга",
      lastName: "Лебедева",
      email: "lebedeva@mail.com",
      group: "ПИ-202",
      grades: { 1: 90, 2: 92, 3: 88, 4: 185 },
      progress: 89
    },
  ];

  // Получение уникальных групп для фильтра
  const uniqueGroups = useMemo(() => {
    return [...new Set(students.map(student => student.group))];
  }, [students]);

  // Фильтрация и сортировка данных
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      // Фильтр по группам
      if (filters.groups.length > 0 && !filters.groups.includes(student.group)) {
        return false;
      }

      // Поиск по тексту (ФИО, email, группа)
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        if (!fullName.includes(searchLower) && 
            !student.email.toLowerCase().includes(searchLower) &&
            !student.group.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Фильтр по прогрессу
      if (student.progress < filters.progressRange[0] || student.progress > filters.progressRange[1]) {
        return false;
      }

      return true;
    });

    // Сортировка
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case 'student':
            aValue = `${a.firstName} ${a.lastName}`;
            bValue = `${b.firstName} ${b.lastName}`;
            break;
          case 'group':
            aValue = a.group;
            bValue = b.group;
            break;
          case 'progress':
            aValue = a.progress;
            bValue = b.progress;
            break;
          case 'average':
            const aGrades = Object.values(a.grades).filter(g => g !== null);
            const bGrades = Object.values(b.grades).filter(g => g !== null);
            aValue = aGrades.length > 0 ? aGrades.reduce((sum, grade) => sum + grade, 0) / aGrades.length : 0;
            bValue = bGrades.length > 0 ? bGrades.reduce((sum, grade) => sum + grade, 0) / bGrades.length : 0;
            break;
          default:
            // Сортировка по заданиям
            if (sortConfig.key.startsWith('assignment_')) {
              const assignmentId = parseInt(sortConfig.key.split('_')[1]);
              aValue = a.grades[assignmentId] || 0;
              bValue = b.grades[assignmentId] || 0;
            } else {
              aValue = a[sortConfig.key];
              bValue = b[sortConfig.key];
            }
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascend' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascend' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [students, filters, sortConfig]);

  // Обработчики фильтров
  const handleGroupFilter = (selectedGroups) => {
    setFilters(prev => ({ ...prev, groups: selectedGroups }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, searchText: value }));
    setIsSearchModalVisible(false);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascend' ? 'descend' : 'ascend'
    }));
  };

  // Колонки таблицы с фильтрацией и сортировкой
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: (
          <Space>
            Студент
            <Button 
              type="text" 
              size="small" 
              icon={sortConfig.key === 'student' ? 
                (sortConfig.direction === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />) : 
                <SortAscendingOutlined />
              }
              onClick={() => handleSort('student')}
            />
            <Tooltip title="Поиск студентов">
              <Button 
                type="text" 
                size="small" 
                icon={<SearchOutlined />}
                onClick={() => setIsSearchModalVisible(true)}
                style={{ 
                  color: filters.searchText ? '#1890ff' : undefined 
                }}
              />
            </Tooltip>
          </Space>
        ),
        key: "student",
        fixed: "left",
        width: 250,
        render: (_, record) => (
          <Space>
            <Avatar 
              style={{ backgroundColor: "#1890ff" }}
              icon={<UserOutlined />}
            >
              {record.firstName[0]}{record.lastName[0]}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500 }}>
                {record.firstName} {record.lastName}
              </div>
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                {record.email}
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: (
          <Space>
            Группа
            <Button 
              type="text" 
              size="small" 
              icon={sortConfig.key === 'group' ? 
                (sortConfig.direction === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />) : 
                <SortAscendingOutlined />
              }
              onClick={() => handleSort('group')}
            />
          </Space>
        ),
        dataIndex: "group",
        key: "group",
        width: 120,
        render: (group) => <Tag color="blue">{group}</Tag>,
        filters: uniqueGroups.map(group => ({ text: group, value: group })),
        filteredValue: filters.groups,
        onFilter: (value, record) => record.group === value,
      },
    ];

    // Колонки для заданий
    const assignmentColumns = assignments.map(assignment => ({
      title: (
        <Space>
          {assignment.name}
          <Button 
            type="text" 
            size="small" 
            icon={sortConfig.key === `assignment_${assignment.id}` ? 
              (sortConfig.direction === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />) : 
              <SortAscendingOutlined />
            }
            onClick={() => handleSort(`assignment_${assignment.id}`)}
          />
        </Space>
      ),
      key: `assignment_${assignment.id}`,
      width: 130,
      align: "center",
      render: (_, record) => {
        const grade = record.grades[assignment.id];
        if (grade === null || grade === undefined) {
          return <Tag color="default">Не сдано</Tag>;
        }
        
        const percentage = (grade / assignment.maxScore) * 100;
        let color = "red";
        if (percentage >= 90) color = "green";
        else if (percentage >= 75) color = "blue";
        else if (percentage >= 60) color = "orange";

        return (
          <Tooltip title={`${grade} из ${assignment.maxScore} (${percentage.toFixed(1)}%)`}>
            <Tag color={color}>{grade}</Tag>
          </Tooltip>
        );
      }
    }));

    // Колонки итогов
    const summaryColumns = [
      {
        title: (
          <Space>
            Средний балл
            <Button 
              type="text" 
              size="small" 
              icon={sortConfig.key === 'average' ? 
                (sortConfig.direction === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />) : 
                <SortAscendingOutlined />
              }
              onClick={() => handleSort('average')}
            />
          </Space>
        ),
        key: "average",
        width: 140,
        align: "center",
        render: (_, record) => {
          const grades = Object.values(record.grades).filter(g => g !== null);
          if (grades.length === 0) return <Tag>Нет оценок</Tag>;
          
          const totalMax = assignments.reduce((sum, a) => sum + a.maxScore, 0);
          const totalGrade = Object.entries(record.grades)
            .reduce((sum, [assignmentId, grade]) => {
              if (grade === null) return sum;
              return sum + grade;
            }, 0);
          
          const percentage = (totalGrade / totalMax) * 100;
          
          return (
            <Tooltip title={`${totalGrade} из ${totalMax} баллов`}>
              <Tag color={percentage >= 75 ? "green" : percentage >= 60 ? "orange" : "red"}>
                {percentage.toFixed(1)}%
              </Tag>
            </Tooltip>
          );
        }
      },
    {
    title: (
        <Space>
        Прогресс
        <Button 
            type="text" 
            size="small" 
            icon={sortConfig.key === 'progress' ? 
            (sortConfig.direction === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />) : 
            <SortAscendingOutlined />
            }
            onClick={() => handleSort('progress')}
        />
        </Space>
    ),
    key: "progress",
    width: 160,
    render: (_, record) => (
        <Tooltip title={`${record.progress}% выполнено`}>
        <Progress 
            percent={record.progress} 
            size="small"
            status={record.progress < 50 ? "exception" : record.progress < 75 ? "normal" : "success"}
        />
        </Tooltip>
    )
    }
    ];

    return [...baseColumns, ...assignmentColumns, ...summaryColumns];
  }, [assignments, filters.groups, sortConfig, uniqueGroups, filters.searchText]);

  // Статистика с учетом фильтров
  const statistics = useMemo(() => {
    if (!selectedCourse) {
      return {
        totalStudents: 0,
        averageGrade: 0,
        completedAssignments: 0,
        totalAssignments: 0,
        pendingReview: 0
      };
    }

    const totalStudents = filteredAndSortedStudents.length;
    const totalAssignments = assignments.length * filteredAndSortedStudents.length;
    
    let completedCount = 0;
    let totalGradeSum = 0;
    let gradedCount = 0;

    filteredAndSortedStudents.forEach(student => {
      Object.values(student.grades).forEach(grade => {
        if (grade !== null) {
          completedCount++;
          totalGradeSum += grade;
          gradedCount++;
        }
      });
    });

    const averageGrade = gradedCount > 0 ? (totalGradeSum / gradedCount).toFixed(1) : 0;
    const pendingReview = filteredAndSortedStudents.reduce((count, student) => {
      const nullGrades = Object.values(student.grades).filter(grade => grade === null).length;
      return count + nullGrades;
    }, 0);

    return {
      totalStudents,
      averageGrade,
      completedAssignments: completedCount,
      totalAssignments,
      pendingReview
    };
  }, [selectedCourse, filteredAndSortedStudents, assignments]);

  const handleCourseChange = (courseId) => {
    setIsLoading(true);
    setSelectedCourse(courseId);
    
    // Сброс фильтров при смене курса
    setFilters({
      groups: [],
      searchText: "",
      progressRange: [0, 100]
    });
    setSortConfig({
      key: null,
      direction: 'ascend'
    });

    // Имитация загрузки данных
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Модальное окно поиска
  const SearchModal = () => (
    <Modal
      title="Поиск студентов"
      open={isSearchModalVisible}
      onCancel={() => setIsSearchModalVisible(false)}
      footer={[
        <Button key="reset" onClick={() => handleSearch('')}>
          Сбросить поиск
        </Button>,
        <Button key="cancel" onClick={() => setIsSearchModalVisible(false)}>
          Отмена
        </Button>,
      ]}
      width={400}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <p style={{ marginBottom: 8, color: '#666' }}>
            Поиск по ФИО, email или группе:
          </p>
          <Search
            placeholder="Введите текст для поиска..."
            allowClear
            enterButton="Найти"
            size="large"
            defaultValue={filters.searchText}
            onSearch={handleSearch}
          />
        </div>
        {filters.searchText && (
          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#f0f7ff', 
            borderRadius: 6,
            border: '1px solid #1890ff'
          }}>
            <span style={{ color: '#1890ff', fontSize: 12 }}>
              Активный поиск: "{filters.searchText}"
            </span>
          </div>
        )}
      </Space>
    </Modal>
  );

  return (
    <div style={{ padding: 24, backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Шапка с навигацией */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#262626' }}>Электронный журнал</Title>
        </Col>
      </Row>

      {/* Выбор курса */}
      <Card 
        style={{ 
          marginBottom: 24, 
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <Space size="middle" align="center">
          <span style={{ fontWeight: 500, fontSize: 16 }}>Выберите курс:</span>
          <Select
            placeholder="Выберите курс"
            style={{ width: 300 }}
            onChange={handleCourseChange}
            options={courses.map(course => ({
              value: course.id,
              label: course.title
            }))}
            size="large"
          />
        </Space>
      </Card>

      {/* Статистика */}
      {selectedCourse && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card 
              style={{ borderRadius: 8, textAlign: 'center' }}
              styles={{ body: { padding: '20px 16px' } }}
            >
              <Statistic 
                title="Всего студентов" 
                value={statistics.totalStudents} 
                styles={{ content: { color: '#1890ff', fontSize: '28px' } }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card 
              style={{ borderRadius: 8, textAlign: 'center' }}
              styles={{ body: { padding: '20px 16px' } }}
            >
              <Statistic 
                title="Средний балл" 
                value={statistics.averageGrade} 
                styles={{ content: { color: '#52c41a', fontSize: '28px' } }}
                suffix="баллов"
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card 
              style={{ borderRadius: 8, textAlign: 'center' }}
              styles={{ body: { padding: '20px 16px' } }}
            >
              <Statistic 
                title="Выполнено заданий" 
                value={statistics.completedAssignments} 
                styles={{ content: { color: '#fa8c16', fontSize: '28px' } }}
                suffix={`/ ${statistics.totalAssignments}`}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card 
              style={{ borderRadius: 8, textAlign: 'center' }}
              styles={{ body: { padding: '20px 16px' } }}
            >
              <Statistic 
                title="На проверке" 
                value={statistics.pendingReview} 
                styles={{ content: { color: '#fa541c', fontSize: '28px' } }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card 
              style={{ borderRadius: 8, textAlign: 'center' }}
              styles={{ body: { padding: '20px 16px' } }}
            >
              <Statistic 
                title="Процент выполнения" 
                value={((statistics.completedAssignments / statistics.totalAssignments) * 100).toFixed(1)} 
                styles={{ content: { color: '#722ed1', fontSize: '28px' } }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Информация о выбранном курсе */}
      {selectedCourse && (
        <Card 
          style={{ 
            marginBottom: 24, 
            borderRadius: 8,
            backgroundColor: '#f0f7ff',
            border: '1px solid #1890ff'
          }}
          styles={{ body: { padding: '16px 24px' } }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  {courses.find(c => c.id === selectedCourse)?.title}
                </Title>
                <Tag color="blue" style={{ fontSize: 14, padding: '4px 8px' }}>
                  Активный курс
                </Tag>
              </Space>
            </Col>
            <Col>
              <Space>
                {filters.groups.length > 0 && (
                  <Badge count={filters.groups.length} showZero={false}>
                    <Tag color="orange">Фильтр по группам</Tag>
                  </Badge>
                )}
                {filters.searchText && (
                  <Tag color="purple">
                    <Space>
                      <SearchOutlined />
                      Поиск: "{filters.searchText}"
                    </Space>
                  </Tag>
                )}
                {(filters.groups.length > 0 || filters.searchText) && (
                  <Button 
                    type="text" 
                    size="small"
                    onClick={() => {
                      setFilters({
                        groups: [],
                        searchText: "",
                        progressRange: [0, 100]
                      });
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* Таблица студентов */}
      {selectedCourse && (
        <Card 
          style={{ 
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          styles={{ body: { padding: 0 } }}
        >
          <Table
            columns={columns}
            dataSource={filteredAndSortedStudents.map(student => ({ ...student, key: student.id }))}
            loading={isLoading}
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `Показано ${range[0]}-${range[1]} из ${total} студентов`,
              pageSizeOptions: ['10', '20', '50'],
              style: { marginTop: 16, marginRight: 16 }
            }}
            size="middle"
          />
        </Card>
      )}

      {/* Сообщение при невыбранном курсе */}
      {!selectedCourse && (
        <Card 
          style={{ 
            textAlign: 'center', 
            borderRadius: 8,
            backgroundColor: '#fafafa'
          }}
          styles={{ body: { padding: '60px' } }}
        >
          <Title level={3} style={{ color: '#8c8c8c' }}>
            Выберите курс для просмотра журнала
          </Title>
          <p style={{ color: '#8c8c8c', fontSize: 16 }}>
            Пожалуйста, выберите курс из выпадающего списка выше чтобы увидеть успеваемость студентов
          </p>
        </Card>
      )}

      {/* Модальное окно поиска */}
      <SearchModal />
    </div>
  );
};

export default GradebookPage;