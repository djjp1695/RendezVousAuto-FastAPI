from http import HTTPStatus

from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse, Response

from Models.Technicien import Technicien, TechnicienCreate
from Services.TechnicienService import TechnicienService

NAME = 'Technicien'


def create_technicien_router(technicienService: TechnicienService):
    router = APIRouter(prefix=f"/{NAME}")
    technicienService = technicienService

    @router.get("/", response_model=list[Technicien])
    async def get_all():
        techniciens = await technicienService.get_all()
        if techniciens is None or len(techniciens) == 0:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Aucuns techniciens trouvés")
        return techniciens

    @router.get("/recherche", )
    async def get_by_filtres(nom: str, prenom: str):
        tecnicien = await technicienService.get_by_filtres(nom, prenom)
        if tecnicien is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Technicien non trouvé")
        return tecnicien

    @router.get("/{id}", response_model=Technicien)
    async def get_by_id(id: int):
        technicien = await technicienService.get_by_id(id)
        if technicien is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Aucun technicien trouvé")
        return technicien

    @router.post("/", response_model=Technicien)
    async def create_technicien(technicienCreate: TechnicienCreate):
        technicienExistant = await  technicienService.get_by_filtres(technicienCreate.nom, technicienCreate.prenom)
        if technicienExistant is not None:
            raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Technicien existant")
        technicien = await technicienService.add(Technicien(**technicienCreate.model_dump()))
        if technicien is None:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Erreur de création d'un nouveau technicien")
        return technicien

    @router.put("/{id}/actif")
    async def update_status(id: int, actif: bool):
        technicien = await technicienService.update_status(id, actif)
        if technicien is None:
            raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="Technicien non présent")
        return technicien

    @router.put("/{id}")
    async def update(id: int, technicienCreate: TechnicienCreate):
        technicien = await technicienService.update(id, Technicien(**technicienCreate.model_dump()))
        if technicien is None:
            raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="Technicien non présent")
        return technicien

    @router.delete("/all", response_class=JSONResponse)
    async def delete_all():
        status = await technicienService.delete_all()
        if status is True:
            return Response(status_code=HTTPStatus.OK)
        else:
            return JSONResponse(status_code=HTTPStatus.BAD_REQUEST, content={"message": "Aucuns technicien présents"})

    @router.delete("/{id}", response_class=JSONResponse)
    async def delete_technicien(id: int):
        status = await technicienService.delete_by_id(id)
        if status is True:
            return Response(status_code=HTTPStatus.OK)
        else:
            return JSONResponse(status_code=HTTPStatus.BAD_REQUEST, content={"message": "Technicien non trouvé"})

    return router
