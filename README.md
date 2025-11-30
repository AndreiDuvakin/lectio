
# ВНИМАНИЕ

Просьба дочитать данный файл от начала и до КОНЦА, чтобы не упустить важную информацию касающуюся демонстрации проекта

# Lectio

**Lectio** — Система позволяет создавать курсы с лекциями и заданиями, записываться на них, отмечать прочитанные материалы, загружать решения с файлами любой сложности, а преподавателям — выставлять ручные оценки. Реализована ролевая модель (студент / преподаватель / администратор), автоматический подсчёт прогресса по курсу, детальный журнал успеваемости с максимальными оценками и статусом чтения лекций, а также личный кабинет студента, где он видит только свою успеваемость. 

## Наша команда Numerum

Дувакин Андрей - фуллстак + дувопс 
Лучевников Лев - фронтэнд-разработчик 
Филимонов Михаил - бэкэнд-разработчик 
Сотов Дмитрий - фронтэнд-разработчик 

## Технологический стек
* Backend: FastAPI (Python), SQLAlchemy 2.0, PostgreSQL, JWT-аутентификация
* Frontend: React + Vite + JavaScript + Ant Design + RTK Query
* Инфраструктура: Docker, Kubernetes (microk8s), Helm-чарт, cert-manager + Let’s Encrypt

## Развернутый дистрибутив
WEB: https://lectio.numerum.team  
API: https://api.lectio.numerum.team (с автоматической Swagger-документацией)  
Хранение файлов: PersistentVolume с hostPath

## Структура проекта
### API
Бэкенд построен на FastAPI с луковой архитектурой.
```
app/
├── controllers/         — FastAPI-роутеры (auth, courses, lessons, tasks, solutions и т.д.)
├── infrastructure/      — сервисы бизнес-логики (gradebook_service, solutions_service и др.)
├── application/         — репозитории (работа с БД через SQLAlchemy 2.0 async)
├── domain/
│   ├── models/          — SQLAlchemy-модели (ORM)
│   └── entities/        — Pydantic-схемы для запросов/ответов
├── database/            — сессии, Alembic-миграции
├── core/                — константы, настройки
└── main.py, settings.py
```
API спроектирован так, что добавление новых сущностей (например, сертификаты, тесты, группы) требует минимум изменений — достаточно добавить модель, репозиторий, сервис и роутер.

### WEB
Фронтенд реализован на  React + Vite + JavaScript с использованием UI-библиотеки Ant Design и state-менеджмента через RTK Query.
```
src/
├── Api/                — RTK Query API-слайсы (authApi, coursesApi, gradebookApi, solutionsApi и др.)
├── App/                — маршрутизация, PrivateRoute, AdminRoute, ErrorBoundary
├── Components/
│   ├── Layouts/        — MainLayout (шапка, сайдбар, адаптивность)
│   ├── Pages/          — все страницы: CoursesPage, CourseDetailPage, GradebookPage, Login, Profile и др.
│   └── Widgets/        — переиспользуемые компоненты (модалки, лоадеры)
├── Redux/              — store + слайсы состояния (auth, courses, modals)
├── Core/               — константы, конфиги (VITE_BASE_URL, роли)
├── Hooks/              — кастомные хуки (useAuthUtils и др.)
└── Styles/             — глобальные стили
```

## Система ролей

В системе реализована строгая ролевая модель с тремя ролями. Права проверяются как на бэкенде (зависимости FastAPI), так и на фронтенде (PrivateRoute / AdminRoute).

### Администратор

- Всё, что может преподаватель
- Управление пользователями (создание, редактирование, удаление, смена роли)
- Управление ролями и статусами
- Просмотр и редактирование всех курсов и их содержимого
- Доступ ко всем журналам успеваемости


### Преподаватель

- Создавать, редактировать и удалять свои курсы
- Добавлять/редактировать лекции и задания
- Назначать себе и другим преподавателям курсы
- Просматривать полный журнал успеваемости по своим курсам
- Выставлять оценки и комментарии к решениям студентов
- Скачивать все файлы решений


### Студент

- Просматривать список всех курсов и записываться на них
- Просматривать лекции и отмечать их как «прочитанные»
- Загружать решения заданий
- Видеть свой прогресс по каждому курсу
- Видеть свою успеваемость в журнале (только свою)
- Редактировать свой профиль (ФИО, фото и т.д.)

## Развертывание проекта

### API

Бэкенд можно запустить тремя способами — от самого простого до полноценного production-деплоймента.

#### 1. Локальный запуск (без Docker)

```bash
# Клонируем репозиторий
git clone https://github.com/AndreiDuvakin/lectio.git
cd lectio/api

# Создаём виртуальное окружение и устанавливаем зависимости
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r req.txt

# Создаём файл .env в корне api/
cp .env.example .env
# Редактируем .env — обязательно заполняем:
DB_DRIVER=postgresql+asyncpg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=lectio
DB_SCHEMA=public
SECRET_KEY=your_very_strong_secret_key_here

# Применяем миграции
alembic upgrade head

# Запускаем сервер
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API: http://localhost:8000

#### 2. Запуск через Docker

Обратите внимание, что для хранения файлов необходимо создавать хранилище.  
**Вариант A — просто тянуть готовый образ**  
```bash
docker run -d \
  --name lectio-api \
  -p 8000:8000 \
  -e DB_DRIVER=postgresql+asyncpg \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your_password \
  -e DB_NAME=lectio \
  -e DB_SCHEMA=public \
  -e SECRET_KEY=supersecretkey123 \
  -v ./uploads:/app/uploads \
  andreiduvakin/lectio-api:latest
```

**Вариант B — собрать локально**  
Запускается из папки api:
```bash
docker build -t lectio-api . -а app/Dockerfile
docker run -d --name lectio-api -p 8000:8000 lectio-api
```

#### 3. Production-развёртывание в Kubernetes
Используется Helm-чарт **k8s/helm/lectio-api**.
```bash
# Устанавливаем чарт (пример для нашего microk8s)
helm upgrade --install lectio-web k8s/helm/lectio-web --namespace lectio-web --create-namespace
```
Что нужно настроить в **values.yaml**:
```
env:
  DB_DRIVER: postgresql+asyncpg
  DB_HOST: db.numerum.team
  DB_PORT: 30000
  DB_USER: lectio
  DB_NAME: lectio
  DB_SCHEMA: public
```

**Secret** с чувствительными данными:
```
# k8s/helm/lectio-api/templates/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lectio-api-secret
type: Opaque
data:
  SECRET_KEY: base64_encoded_very_long_key==
  DB_PASSWORD: base64_encoded_password==
```

**ОБРАТИТЕ ВНИМАНИЕ**  
В настоящем решении не предоставлен действительный файл **k8s/helm/lectio-api/templates/secrets.yaml** - для предотвращения несанкционированного доступа к нашей базе данных. Для ВАШЕЙ конфигурации нужно создавать свой файл.

PersistentVolume автоматически создаётся через pvc.yaml и монтирует папку /mnt/k8s_storage/lectio-api/uploads на хосте — все загруженные студентами файлы сохраняются между перезапусками.
После деплоя:

API: https://api.lectio.numerum.team/  
Swagger/ReDoc: https://api.lectio.numerum.team/docs

Именно так система работает в продакшене прямо сейчас — с HTTPS, Let’s Encrypt, персистентным хранилищем и автоматическим масштабированием.

### WEB

Фронтенд можно запустить тремя способами — от локальной разработки до production-развёртывания в Kubernetes.

### 1. Локальный запуск

```bash
git clone https://github.com/AndreiDuvakin/lectio.git
cd lectio/web

# Устанавливаем зависимости
npm install

# Создаём .env файл (в корне web/)
echo "VITE_BASE_URL=http://localhost:8000/api/v1
VITE_ROOT_ROLE_NAME=root" > .env

# Запускаем dev-сервер
npm run dev
```
Приложение будет доступно по адресу: http://localhost:5173

### 2. Запуск через Docker
Запускается из папки web:
**Вариант A — готовый образ**  
Готовый образ уже собран с продакшен-настройками!
**VITE_BASE_URL** и **VITE_ROOT_ROLE_NAME** жёстко зашиты в образ на этапе сборки:
```Dockerfile
ENV VITE_BASE_URL=https://api.lectio.numerum.team/api/v1
ENV VITE_ROOT_ROLE_NAME=root
```
Поэтому запуск предельно прост:
```bash
docker run -d \
  --name lectio-web \
  -p 3000:3000 \
  andreiduvakin/lectio-web:latest
```

**Вариант B — сборка локально**  
```bash
docker run -d \
  --name lectio-web \
  -p 3000:3000 \
  --build-arg VITE_BASE_URL=http://localhost:8000/api/v1 \
  andreiduvakin/lectio-web:latest
```
Приложение доступно по адресу: http://localhost:3000

### 3. Production-развёртывание в Kubernetes

Используется Helm-чарт k8s/helm/lectio-web.

```bash
helm upgrade --install lectio-web k8s/helm/lectio-web --namespace lectio-web --create-namespace
```

Поскольку переменные окружения уже зашиты в образ на этапе **npm run build**, в **values.yaml** ничего передавать не нужно.

После деплоя приложение доступно по адресу:
https://lectio.numerum.team  
Именно так работает продакшен прямо сейчас.


## Демонстрация 

Видео УСТАНОВКИ и ДЕМОНСТРАЦИИ проекта достпуно по ссылке: https://disk.yandex.ru/i/sDi_GnOUBnpVaA

Пожалуйста, досмотрите видео целиком.

# ВНИМАНИЕ

Для того, чтобы можно было протестировать систему в развернутом виде с разных ролей были подготовлены следующие авторизационные данные для проверки на:
https://lectio.numerum.team 

* Администратор:  
Логин: admin  
Пароль: Password1!

* Студент:
Логин: student  
Пароль: Password1!

*  Учитель:
Логин: teacher  
Пароль: Password1!

## Регистрация

В системе можно зарегистрироваться перейдя на страницу регистрации из страницы авторизации, но по умолчанию вам будет выдана роль Студент без зачисления на курс