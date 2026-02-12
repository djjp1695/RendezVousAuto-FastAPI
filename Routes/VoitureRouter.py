import json

from fastapi import APIRouter
from starlette.responses import JSONResponse, HTMLResponse

from Database.Business.Voiture import Voiture

ROUTER_NAME = "Voitures"


def create_voiture_router(voitureService) -> APIRouter:
    router = APIRouter(prefix=f"/{ROUTER_NAME}")
    voiture_service = voitureService;

    @router.get('/', response_class=JSONResponse)
    async def voitures():
        return json.dumps([u.to_dict() for u in await voitureService.get_all_voitures()])

    @router.get("/{id}", response_class=HTMLResponse)
    async def voiture_by_id(id):
        voiture = await voitureService.get_voiture_by_id(id)
        return json.dumps(voiture.to_dict())

    return router
