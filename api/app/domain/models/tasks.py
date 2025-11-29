from typing import List

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class Task(RootTable):
    __tablename__ = 'tasks'

    title: Mapped[str] = mapped_column(String(250), nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)
    text: Mapped[str] = mapped_column(nullable=True)
    number: Mapped[int] = mapped_column(nullable=False)

    course_id: Mapped[int] = mapped_column(ForeignKey('courses.id'), nullable=False)
    creator_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)

    course: Mapped['Course'] = relationship('Course', back_populates='tasks')
    creator: Mapped['User'] = relationship('User', back_populates='created_tasks', lazy='joined')

    files: Mapped[List['TaskFile']] = relationship('TaskFile', back_populates='task')
