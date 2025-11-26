from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.domain.models import Base


class RootTable(Base):
    __abstract__ = True

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=False)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())


class PhotoAbstract(RootTable):
    __abstract__ = True

    photo_filename: Mapped[str] = mapped_column()
    photo_path: Mapped[str] = mapped_column()


class FileAbstract(RootTable):
    __abstract__ = True

    filename: Mapped[str] = mapped_column()
    file_path: Mapped[str] = mapped_column()
