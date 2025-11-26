from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.models.base import RootTable


class Role(RootTable):
    __tablename__ = 'roles'

    title: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)

    users: Mapped[List['User']] = relationship('User', back_populates='role')
