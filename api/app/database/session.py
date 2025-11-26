from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.settings import get_db_url

engine = create_async_engine(get_db_url(), echo=False)

async_session_maker = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


async def get_db():
    async with async_session_maker() as session:
        yield session
