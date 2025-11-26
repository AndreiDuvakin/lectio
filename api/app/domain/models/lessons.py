from typing import List

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class Lesson(RootTable):
    __tablename__ = 'lessons'

    title: Mapped[str] = mapped_column(String(250), nullable=False)
    description: Mapped[str] = mapped_column()
    text: Mapped[str] = mapped_column()
    number: Mapped[int] = mapped_column(nullable=False)

    course_id: Mapped[int] = mapped_column(ForeignKey('courses.id'), nullable=False)
    creator_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)

    course: Mapped['Course'] = relationship('Course', back_populates='lessons')
    creator: Mapped['User'] = relationship('User', back_populates='created_lessons')

    files: Mapped[List['LessonFile']] = relationship('LessonFile', back_populates='lessons')
