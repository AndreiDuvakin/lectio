import jwt
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.users_repository import UsersRepository
from app.core.constants import UserStatuses, UserRoles
from app.database.session import get_db
from app.domain.models.users import User
from app.settings import get_auth_data, Settings

security = HTTPBearer()


async def require_auth_user(
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: AsyncSession = Depends(get_db)
) -> User:
    auth_data = get_auth_data()

    try:
        payload = jwt.decode(credentials.credentials, auth_data['secret_key'], algorithms=[auth_data['algorithm']])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Ошибка авторизации')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Ошибка авторизации')

    user_id = payload.get('user_id')
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Ошибка авторизации')

    user = await UsersRepository(db).get_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Ошибка авторизации')

    if user.status.title != UserStatuses.ACTIVE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Ошибка авторизации')

    return user


def require_admin(user: User = Depends(require_auth_user)):
    if user.role.title != Settings().root_role_name:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Ошибка доступа')

    return user


def require_teacher(user: User = Depends(require_auth_user)):
    print(user.role.title, user.role.title not in [UserRoles.TEACHER, Settings().root_role_name], [UserRoles.TEACHER, Settings().root_role_name])
    if user.role.title not in [UserRoles.TEACHER, Settings().root_role_name]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Ошибка доступа')

    return user
