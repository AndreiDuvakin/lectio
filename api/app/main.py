from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.controllers.auth_router import auth_router
from app.controllers.courses_router import courses_router
from app.controllers.lessons_router import lessons_router
from app.controllers.register_router import register_router
from app.controllers.roles_router import roles_router
from app.controllers.solution_comments_router import solution_comments_router
from app.controllers.solutions_router import solution_router
from app.controllers.statuses_router import statuses_router
from app.controllers.tasks_router import tasks_router
from app.controllers.users_router import users_router
from app.settings import Settings


def start_app():
    api_app = FastAPI()
    settings = Settings()

    api_app.add_middleware(
        CORSMiddleware,
        allow_origins=['https://api.lectio.numerum.team', 'https://lectio.numerum.team', 'http://localhost:5173'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    api_app.include_router(auth_router, prefix=f'{settings.prefix}/auth', tags=['auth'])
    api_app.include_router(courses_router, prefix=f'{settings.prefix}/courses', tags=['courses'])
    api_app.include_router(lessons_router, prefix=f'{settings.prefix}/lessons', tags=['lessons'])
    api_app.include_router(register_router, prefix=f'{settings.prefix}/register', tags=['register'])
    api_app.include_router(roles_router, prefix=f'{settings.prefix}/roles', tags=['roles'])
    api_app.include_router(solution_comments_router, prefix=f'{settings.prefix}/comments', tags=['comments'])
    api_app.include_router(solution_router, prefix=f'{settings.prefix}/solutions', tags=['solutions'])
    api_app.include_router(statuses_router, prefix=f'{settings.prefix}/statuses', tags=['statuses'])
    api_app.include_router(tasks_router, prefix=f'{settings.prefix}/tasks', tags=['tasks'])
    api_app.include_router(users_router, prefix=f'{settings.prefix}/users', tags=['users'])

    return api_app


app = start_app()


@app.get('/', tags=['root'])
async def root():
    return {'message': 'Hello :з'}
