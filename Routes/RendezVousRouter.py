from http import HTTPStatus
from fastapi import APIRouter, HTTPException
from Models.RendezVous import RendezVousOut

ROUTER_NAME = 'RendezVous'


class RendezVousRouter:

    def __init__(self, rendezVousService, apiLink):
        self.router = APIRouter(prefix=f"{apiLink}/{ROUTER_NAME}")
        self.__rendezVousService = rendezVousService
        self.ajouter_routes()

    def ajouter_routes(self):
        @self.router.get('/', response_model=list[RendezVousOut], status_code=200)
        async def index():
            rendezVous = await self.__rendezVousService.get_all_rendezVous();
            if not rendezVous:
                raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No rendezvous found")
            return rendezVous;
