from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import PhotoAbstract


class Course(PhotoAbstract):
    __tablename__ = 'courses'

    title: Mapped[str] = mapped_column(String(250), nullable=False)
    description: Mapped[str] = mapped_column(String(1000))

    teachers: Mapped[List['CourseTeacher']] = relationship('CourseTeacher', back_populates='course')
    enrollments: Mapped[List['Enrollment']] = relationship('Enrollment', back_populates='course')
    lessons: Mapped[List['Lesson']] = relationship('Lesson', back_populates='course')
    tasks: Mapped[List['Task']] = relationship('Task', back_populates='course')
