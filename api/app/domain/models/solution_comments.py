from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class SolutionComment(RootTable):
    __tablename__ = 'solution_comments'

    comment_text: Mapped[str] = mapped_column(nullable=False)

    comment_autor_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    solution_id: Mapped[int] = mapped_column(ForeignKey('solutions.id'), nullable=False)

    comment_autor: Mapped['User'] = relationship('User', back_populates='solution_comments', lazy='joined')
    solution: Mapped['Solution'] = relationship('Solution', back_populates='solution_comments')