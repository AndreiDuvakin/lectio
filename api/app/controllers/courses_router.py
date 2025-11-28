from typing import List, Optional

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.course_teachers import CourseTeacherRead, CourseTeacherCreate
from app.domain.entities.courses import CourseRead, CourseCreate, CourseUpdate, CourseCreated
from app.domain.entities.enrollments import EnrollmentRead, EnrollmentCreate
from app.domain.models import User
from app.infrastructure.course_teachers_service import CourseTeachersService
from app.infrastructure.courses_service import CoursesService
from app.infrastructure.dependencies import require_auth_user, require_teacher, require_admin
from app.infrastructure.enrollments_service import EnrollmentsService

courses_router = APIRouter()


@courses_router.get(
    '/',
    response_model=List[CourseRead],
    summary='Return all courses',
    description='Return all courses',
)
async def get_all_courses(
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_admin),
):
    courses_service = CoursesService(db)
    return await courses_service.get_all()


@courses_router.get(
    '/{course_id}/',
    response_model=Optional[CourseRead],
    summary='Return a specific course',
    description='Return a specific course',
)
async def get_course(
        course_id: int,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user),
):
    courses_service = CoursesService(db)
    return await courses_service.get_by_id(course_id)


@courses_router.post(
    '/',
    response_model=Optional[CourseCreated],
    summary='Create a new course',
    description='Create a new course',
)
async def create_new_course(
        course: CourseCreate,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_teacher),
):
    courses_service = CoursesService(db)
    return await courses_service.create(course)


@courses_router.put(
    '/{course_id}/',
    response_model=Optional[CourseRead],
    summary='Update a course',
    description='Update a course',
)
async def update_course(
        course_id: int,
        course: CourseUpdate,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_teacher),
):
    courses_service = CoursesService(db)
    return await courses_service.update(course_id, course)


@courses_router.get(
    '/{course_id}/teachers/',
    response_model=List[CourseTeacherRead],
    summary='Return all teachers',
    description='Return all teachers',
)
async def get_course_teachers(
        course_id: int,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user),
):
    service = CourseTeachersService(db)
    teachers = await service.get_course_teachers_by_course_id(course_id)
    return teachers


@courses_router.put(
    '/{course_id}/teachers/',
    response_model=List[CourseTeacherRead],
    summary='Replace all teachers in a course',
    description='Replace all teachers in a course',
)
async def replace_course_teachers(
        course_id: int,
        teachers: List[CourseTeacherCreate],
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_teacher),
):
    service = CourseTeachersService(db)
    return await service.replace_course_teachers_list(teachers, course_id)


@courses_router.get(
    '/{course_id}/students/',
    response_model=List[EnrollmentRead],
    summary='Return all students of the course',
    description='Return all students enrolled in the course',
)
async def get_course_students(
        course_id: int,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user),
):
    service = EnrollmentsService(db)
    students = await service.get_course_students_by_course_id(course_id)
    return students


@courses_router.put(
    '/{course_id}/students/',
    response_model=List[EnrollmentRead],
    summary='Replace all students in a course',
    description='Completely replace the list of enrolled students',
)
async def replace_course_students(
        course_id: int,
        students: List[EnrollmentCreate],
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_teacher),
):
    service = EnrollmentsService(db)
    return await service.replace_course_students_list(students, course_id)
