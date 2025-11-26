from typing import List

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class Solution(RootTable):
    __tablename__ = 'solutions'

    answer_text: Mapped[str] = mapped_column()
    assessment_text: Mapped[str] = mapped_column(String(50))

    assessment_autor_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    task_id: Mapped[int] = mapped_column(ForeignKey('tasks.id'), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)

    assessment_autor: Mapped['User'] = relationship('User', back_populates='assessments',
                                                    foreign_keys=[assessment_autor_id])
    student: Mapped['User'] = relationship('User', back_populates='my_solutions', foreign_keys=[student_id])

    files: Mapped[List['SolutionFile']] = relationship('SolutionFile', back_populates='solution')
