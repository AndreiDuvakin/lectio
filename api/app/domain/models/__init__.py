from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

from app.settings import Settings

metadata_obj = MetaData(schema=Settings().db_schema)


class Base(DeclarativeBase):
    metadata = metadata_obj

from app.domain.models.course_teachers import CourseTeacher
from app.domain.models.courses import Course
from app.domain.models.enrollments import Enrollment
from app.domain.models.lesson_files import LessonFile
from app.domain.models.lessons import Lesson
from app.domain.models.roles import Role
from app.domain.models.solution_files import SolutionFile
from app.domain.models.solutions import Solution
from app.domain.models.statuses import Status
from app.domain.models.task_files import TaskFile
from app.domain.models.tasks import Task
from app.domain.models.users import User
