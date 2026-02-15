import json
from http import HTTPStatus

from fastapi import APIRouter
from starlette.responses import JSONResponse

ROUTER_NAME = 'Ressources'


def create_ressources_router(Ressources_service) -> APIRouter:
    router = APIRouter(prefix=f"/api/{ROUTER_NAME}")
    ressources_service = Ressources_service

    @router.get("/", response_class=JSONResponse)
    async def index():
        return json.loads(await  ressources_service.get_ressources())

    return router
