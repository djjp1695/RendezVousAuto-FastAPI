import json
from fastapi import APIRouter
from starlette.responses import JSONResponse

from Services.RessourcesService import RessourceService

ROUTER_NAME = 'Ressources'

class RessourcesRouter:
    def __init__(self, ressources_service : RessourceService, apiLink: str):
        self.router = APIRouter(prefix=f"{apiLink}/{ROUTER_NAME}")
        self.__ressources_service = ressources_service
        self.ajouter_routes()

    def ajouter_routes(self):
        @self.router.get("/", response_class=JSONResponse)
        async def index():
            return json.loads(await  self.__ressources_service.get_ressources())
