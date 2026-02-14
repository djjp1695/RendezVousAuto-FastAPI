from http import HTTPStatus
from fastapi import APIRouter, HTTPException

from Models.RendezVous import RendezVous

ROUTER_NAME = 'RendezVous'

def create_rendezvous_router(rendezVousService) -> APIRouter:
    router = APIRouter(prefix=f"/api/{ROUTER_NAME}")
    rendezvous_service = rendezVousService;

    @router.get('/', response_model=list[RendezVous],status_code=200)
    async def index():
        rendezVous = await rendezVousService.get_all_rendezVous();
        if not rendezVous:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No rendezvous found")
        return rendezVous;

    return router;



