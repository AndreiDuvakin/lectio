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

    secret_key: str = Field(alias='SECRET_KEY')
    algorithm: str = Field(alias='ALGORITHM', default='sha256')

    default_role_name: str = Field(alias='DEFAULT_ROLE_NAME', default='student')
    root_role_name: str = Field(alias='ROOT_ROLE_NAME', default='root')
    default_status: str = Field(alias='DEFAULT_STATUS', default='active')

    prefix: str = Field(alias='PREFIX', default='/api/v1')


def get_db_url() -> str:
    settings = Settings()
    return f'{settings.db_driver}://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}'


def get_auth_data() -> dict:
    settings = Settings()
    return {'secret_key': settings.secret_key, 'algorithm': settings.algorithm}
