from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    db_driver: str = Field(alias='DB_DRIVER')
    db_host: str = Field(alias='DB_HOST')
    db_port: int = Field(alias='DB_PORT')
    db_user: str = Field(alias='DB_USER')
    db_password: str = Field(alias='DB_PASSWORD')
    db_name: str = Field(alias='DB_NAME')
    db_schema: str = Field(alias='DB_SCHEMA')


def get_db_url() -> str:
    settings = Settings()
    return f'{settings.db_driver}://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}'
