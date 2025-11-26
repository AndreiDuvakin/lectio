from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import FileAbstract


class LessonFile(FileAbstract):
    __tablename__ = 'lesson_files'

    lesson_id: Mapped[int] = mapped_column(ForeignKey('lessons.id'), nullable=False)

    lesson: Mapped['Lesson'] = relationship('Lesson', back_populates='files')
