from datetime import date, datetime
from typing import List

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from werkzeug.security import check_password_hash, generate_password_hash

from app.domain.models.base import PhotoAbstract


class User(PhotoAbstract):
    __tablename__ = 'users'

    first_name: Mapped[str] = mapped_column(String(250), nullable=False)
    last_name: Mapped[str] = mapped_column(String(250), nullable=False)
    patronymic: Mapped[str] = mapped_column(String(250), nullable=True)
    login: Mapped[str] = mapped_column(String(250), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(String(250), unique=True, nullable=True)
    birthdate: Mapped[date] = mapped_column(nullable=False)
    reg_date: Mapped[date] = mapped_column(nullable=False, default=func.now())
    last_visit: Mapped[datetime] = mapped_column(nullable=True)
    photo_filename: Mapped[str] = mapped_column(String(250), nullable=True)
    photo_path: Mapped[str] = mapped_column(nullable=True)

    status_id: Mapped[int] = mapped_column(ForeignKey('statuses.id'), nullable=False)
    role_id: Mapped[int] = mapped_column(ForeignKey('roles.id'), nullable=False)

    status: Mapped['Status'] = relationship('Status', back_populates='users', lazy='joined')
    role: Mapped['Role'] = relationship('Role', back_populates='users', lazy='joined')

    teacher_courses: Mapped[List['CourseTeacher']] = relationship('CourseTeacher', back_populates='teacher')
    enrollments: Mapped[List['Enrollment']] = relationship('Enrollment', back_populates='student')
    created_lessons: Mapped[List['Lesson']] = relationship('Lesson', back_populates='creator')
    created_tasks: Mapped[List['Task']] = relationship('Task', back_populates='creator')

    from app.domain.models.solutions import Solution
    assessments: Mapped[List['Solution']] = relationship(
        'Solution',
        back_populates='assessment_autor',
        foreign_keys=[Solution.assessment_autor_id],
    )
    my_solutions: Mapped[List['Solution']] = relationship(
        'Solution',
        back_populates='student',
        foreign_keys=[Solution.student_id],
    )
    from app.domain.models.solution_comments import SolutionComment
    solution_comments: Mapped[List['SolutionComment']] = relationship(
        'SolutionComment',
        back_populates='comment_autor',
    )
    from app.domain.models.user_check_lessons import UserCheckLessons
    user_check_lessons: Mapped[List['UserCheckLessons']] = relationship(
        'UserCheckLessons',
        back_populates='user',
    )

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
