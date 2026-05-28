[🇷🇺 Русский](README_RU.md)

# Project purpose

The project was created to participate in a hackathon to develop an educational information system.

# ATTENTION

Please finish reading this file from the beginning to the END, so as not to miss important information about the project demonstration.

# Lectio

Lectio — The system allows you to create courses with lectures and tasks, sign up for them, mark the materials you read, upload solutions with files of any complexity, and give teachers manual grades. Implemented a role model (student / teacher / administrator), automatic calculation of course progress, a detailed progress log with maximum grades and lecture reading status, as well as a student's personal account, where he sees only his own progress. 

## Our Numerum Team

Andrey Duvakin - fullstack + Devops  
Lev Luchevnikov-frontend developer  
Mikhail Filimonov - backend developer  
Dmitry Sotov-frontend developer  

## Technology stack
* Backend: FastAPI (Python), SQLAlchemy 2.0, PostgreSQL, JWT authentication  
* Frontend: React + Vite + JavaScript + Ant Design + RTK Query  
* Infrastructure: Docker, Kubernetes (microk8s), Helm-chart, cert-manager + Let’s Encrypt

## Deployed distribution
WEB: https://lectio.numerum.team   
API: https://api.lectio.numerum.team (with automatic Swagger documentation)   
File Storage: PersistentVolume with hostPath

## Project structure
### API
The backend is built on FastAPI with onion architecture.
```
app/
├── controllers/         — FastAPI-routers (auth, courses, lessons, tasks, solutions etc.)
├── infrastructure/      — services (gradebook_service, solutions_service etc.)
├── application/         — repositories
├── domain/
│   ├── models/          — SQLAlchemy-models (ORM)
│   └── entities/        — Pydantic-schemes
├── database/            — sessions, Alembic-migrations
├── core/                — constants, settings
└── main.py, settings.py
```

The API is designed so that adding new entities (such as certificates, tests, and groups) requires minimal changes — just add a model, repository, service, and router.

### WEB
The frontend is implemented in React + Vite + JavaScript using the Ant Design UI library and state management via RTK Query.
```
src/
├── Api/                — RTK Query API-slices (authApi, coursesApi, gradebookApi, solutionsApi и др.)
├── App/                — routing, PrivateRoute, AdminRoute, ErrorBoundary
├── Components/
│   ├── Layouts/        — MainLayout (headbar, sidebar, adaptive)
│   ├── Pages/          — all pages: CoursesPage, CourseDetailPage, GradebookPage, Login, Profile и др.
│   └── Widgets/        — components (modal, loaders)
├── Redux/              — store + state slices (auth, courses, modals)
├── Core/               — constants, configs (VITE_BASE_URL, roles)
├── Hooks/              — custom hooks (useAuthUtils и etc.)
└── Styles/             — global style
```

## Role System

The system implements a strict role model with three roles. Permissions are checked both on the backend (FastAPI dependencies) and on the frontend (PrivateRoute / AdminRoute).

### Administrator

"Anything the teacher can do
- User management (creating, editing, deleting, changing roles)
- Manage roles and statuses
- View and edit all courses and their content
- Access to all performance logs

### Teacher

- Create, edit and delete your own courses
- Add / edit lectures and assignments
- Assign courses to yourself and other teachers
- View the full progress log for your courses
- Give ratings and comments on students ' decisions
- Download all solution files

### Student

- View a list of all courses and sign up for them
- View lectures and mark them as "read"
- Upload task solutions
- See your progress on each course
- See your progress in the journal (only your own)
- Edit your profile (full name, photo, etc.)

## Project deployment

### API

The backend can be launched in three ways-from the simplest to a full-fledged production deployment.

#### 1. Local launch (without Docker)

```bash
# Cloning the repository
git clone https://github.com/AndreiDuvakin/lectio.git
cd lectio/api

# Creating a virtual environment and installing dependencies
python -m venv .venv
source .venv/bin/activate # Windows:   .venv\Scripts\activate
pip install -r req.txt

# Creating a file .env in the api root/
cp .env.example .env
# Editing it .env — must be filled in:
DB_DRIVER=postgresql+asyncpg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=lectio
DB_SCHEMA=public
SECRET_KEY=your_very_strong_secret_key_here

# Applying migrations
alembic upgrade head

# Starting the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API: http://localhost:8000

#### 2. Launch via Docker

Please note that you must create a storage facility to store files. 
**Option A-just pull the finished image** 
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

**Option B-build locally** 
Runs from the api folder:
```bash
docker build -t lectio-api . - app/Dockerfile
docker run -d --name lectio-api -p 8000:8000 lectio-api
```

#### 3. Production-deployment in Kubernetes
The Helm chart **k8s/helm/lectio-api**is used.
```bash
# Setting the chart (example for our microk8s)
helm upgrade --install lectio-web k8s/helm/lectio-web --namespace lectio-web --create-namespace
```
What you need to configure in **values. yaml**:
```
env:
DB_DRIVER: postgresql+asyncpg
DB_HOST: db.numerum.team
DB_PORT: 30000
DB_USER: lectio
DB_NAME: lectio
DB_SCHEMA: public
```

**Secret** with sensitive data:
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

**PLEASE NOTE**   
This solution does not provide a valid **k8s/helm/lectio-api/templates/secrets.yaml** file to prevent unauthorized access to our database. You need to create your own file for YOUR configuration.

PersistentVolume is automatically created via a pvc.yaml and mounts the /mnt/k8s_storage/lectio-api/uploads folder on the host — all files uploaded by students are saved between restarts.
After deployment:

API: https://api.lectio.numerum.team/   
Swagger/ReDoc: https://api.lectio.numerum.team/docs

This is exactly how the system works in production right now - with HTTPS, Let's Encrypt, persistent storage, and automatic scaling.

### WEB

The frontend can be launched in three ways: from local development to production deployment in Kubernetes.

### 1. Local launch

```bash
git clone https://github.com/AndreiDuvakin/lectio.git
cd lectio/web

# Installing dependencies
npm install

# Create a .env file (in the root of web/)
echo "VITE_BASE_URL=http://localhost:8000/api/v1
VITE_ROOT_ROLE_NAME=root" > .env

# Starting the dev server
npm run dev
```
The app will be available at: http://localhost:5173

### 2. Launch via Docker
Runs from the web folder:
**Option A-ready image** 
The finished image is already assembled with production settings!
**VITE_BASE_URL** and **VITE_ROOT_ROLE_NAME** are hard-wired into the image at the build stage:
```Dockerfile
ENV VITE_BASE_URL=https://api.lectio.numerum.team/api/v1
ENV VITE_ROOT_ROLE_NAME=root
```
Therefore, the launch is extremely simple:
```bash
docker run -d \
--name lectio-web \
-p 3000:3000 \
andreiduvakin/lectio-web:latest
```

**Option B-Build locally** 
```bash
docker run -d \
--name lectio-web \
-p 3000:3000 \
--build-arg VITE_BASE_URL=http://localhost:8000/api/v1 \
andreiduvakin/lectio-web:latest
```
The app is available at: http://localhost:3000

### 3. Production-deployment in Kubernetes

The k8s/helm/lectio-web Helm chart is used.

```bash
helm upgrade --install lectio-web k8s/helm/lectio-web --namespace lectio-web --create-namespace
```

Since environment variables are already hardwired into the image at the **npm run build** stage, nothing needs to be passed to **values.yaml**.

After deployment, the app is available at:
https://lectio.numerum.team 
This is how production works right now.

## Registration

You can register in the system by going to the registration page from the authorization page, but by default you will be assigned the role of Student without enrolling in the course

## License
MIT. See file [LICENSE](LICENSE).