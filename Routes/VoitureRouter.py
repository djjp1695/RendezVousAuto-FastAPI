from http import HTTPStatus

from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse, Response

from Models.Voiture import Voiture, VoitureCreate

ROUTER_NAME = "Voitures"


def create_voiture_router(voitureService) -> APIRouter:
    router = APIRouter(prefix=f"/{ROUTER_NAME}")
    voiture_service = voitureService

    @router.get("/", response_model=list[Voiture])
    async def voitures():
        voitures = await voiture_service.get_all_voitures()
        if voitures is None or len(voitures) == 0:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail="Aucune voiture présente"
            )
        return voitures

    @router.get("/{id}", response_model=Voiture)
    async def voiture_by_id(id: int):
        voiture = await voiture_service.get_voiture_by_id(id)
        if voiture is None:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail="Voiture not found"
            )
        return voiture

    @router.get("/recherche", response_model=Voiture)
    async def voiture_marque_annee_modele_couleur(
            marque: str,
            annee: int,
            modele: str,
            couleur: str
    ):
        voiture = await voiture_service.get_voiture_filtres(
            marque, annee, modele, couleur
        )
        if voiture is None:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail="Voiture not found"
            )
        return voiture

    @router.put("/{id}", response_model=Voiture)
    async def update_status(id: int, actif: bool):
        voiture = await voiture_service.update_voiture_status(id, actif)
        return voiture

    @router.post("/", response_model=Voiture)
    async def add_voiture(voitureCreate: VoitureCreate):
        voiture = await voiture_service.add_voiture(
            Voiture(**voitureCreate.model_dump())
        )
        if voiture is None:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Erreur de création d'une nouvelle voiture"
            )
        return voiture

    @router.delete("/{id}", response_class=JSONResponse)
    async def delete_voiture(id: int):
        status = await voitureService.delete_voiture_by_id(id)
        if status is True:
            return Response(status_code=HTTPStatus.OK)
        else:
            return Response(status_code=HTTPStatus.BAD_REQUEST)


    return router
