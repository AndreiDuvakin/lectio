from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import FileAbstract


class SolutionFile(FileAbstract):
    __tablename__ = 'solution_files'

    solution_id: Mapped[int] = mapped_column(ForeignKey('solutions.id'), nullable=False)

    solution: Mapped['Solution'] = relationship('Solution', back_populates='files')
