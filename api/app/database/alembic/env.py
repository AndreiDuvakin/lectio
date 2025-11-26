from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine

from app.domain.models import Base
from app.settings import get_db_url

config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


async def run_migrations_online():
    print(get_db_url())
    connectable = create_async_engine(get_db_url(), poolclass=pool.NullPool, future=True)

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def main():
    await run_migrations_online()


import asyncio

asyncio.run(main())
