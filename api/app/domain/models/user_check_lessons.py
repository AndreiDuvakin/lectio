from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class UserCheckLessons(RootTable):
    __tablename__ = 'user_check_lessons'

    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    lesson_id: Mapped[int] = mapped_column(ForeignKey('lessons.id'))

    user: Mapped['User'] = relationship('User', back_populates='user_check_lessons')
    lesson: Mapped['Lesson'] = relationship('Lesson', back_populates='user_check_lessons')
