from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class CourseTeacher(RootTable):
    __tablename__ = 'course_teachers'

    course_id: Mapped[int] = mapped_column(ForeignKey('courses.id'), nullable=False)
    teacher_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)

    course: Mapped['Course'] = relationship('Course', back_populates='teachers')
    teacher: Mapped['User'] = relationship('User', back_populates='teacher_courses')
