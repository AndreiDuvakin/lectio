from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.domain.models import Base


class RootTable(Base):
    __abstract__ = True

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(onupdate=func.now(), server_default=func.now())


class PhotoAbstract(RootTable):
    __abstract__ = True

    photo_filename: Mapped[str] = mapped_column(nullable=True)
    photo_path: Mapped[str] = mapped_column(nullable=True)


class FileAbstract(RootTable):
    __abstract__ = True

    filename: Mapped[str] = mapped_column()
    file_path: Mapped[str] = mapped_column()
