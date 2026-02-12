from fastapi import APIRouter, HTTPException
from http import HTTPStatus
from Database.Business.Voiture import Voiture

ROUTER_NAME = "Voitures"
def create_voiture_router(voitureService) -> APIRouter:
    router = APIRouter(prefix=f"/{ROUTER_NAME}")
    voiture_service = voitureService;

    @router.get('/', response_model=list[Voiture])
    async def voitures():
        voitures = await voitureService.get_all_voitures()
        if not voitures:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Aucun voitures présentes")
        return voitures

    @router.get("/{id}", response_model=Voiture)
    async def voiture_by_id(id):
        voiture = await voitureService.get_voiture_by_id(id)
        if not voiture:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Voiture not found")
        return voiture
    return router
