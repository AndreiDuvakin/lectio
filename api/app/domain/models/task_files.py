from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import FileAbstract


class TaskFile(FileAbstract):
    __tablename__ = 'task_files'

    task_id: Mapped[int] = mapped_column(ForeignKey('tasks.id'), nullable=False)

    task: Mapped['Task'] = relationship('Task', back_populates='files')
