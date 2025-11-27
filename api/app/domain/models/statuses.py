from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class Status(RootTable):
    __tablename__ = 'statuses'

    title: Mapped[str] = mapped_column(String(250), nullable=False, unique=True)

    users: Mapped[List['User']] = relationship('User', back_populates='status')
