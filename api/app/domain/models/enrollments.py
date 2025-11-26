from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class Enrollment(RootTable):
    __tablename__ = 'enrollments'

    enrollment_date: Mapped[datetime] = mapped_column(nullable=False)

    course_id: Mapped[int] = mapped_column(ForeignKey('courses.id'), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)

    course: Mapped['Course'] = relationship('Course', back_populates='enrollments')
    student: Mapped['User'] = relationship('User', back_populates='enrollments')
