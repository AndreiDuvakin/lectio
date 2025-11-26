from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

from app.settings import Settings

metadata_obj = MetaData(schema=Settings().db_schema)


class Base(DeclarativeBase):
    metadata = metadata_obj
