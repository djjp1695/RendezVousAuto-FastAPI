from http import HTTPStatus
from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse, Response

from Models.Technicien import Technicien, TechnicienCreate
from Services.TechnicienService import TechnicienService

NAME = 'Technicien'


class TechnicienRouter:
    def __init__(self, technicienService : TechnicienService, apiLink):
        self.router = APIRouter(prefix=f"{apiLink}/{NAME}")
        self.__technicienService = technicienService
        self.ajouter_routes()


    def ajouter_routes(self):
        @self.router.get("/", response_model=list[Technicien])
        async def get_all():
            techniciens = await self.__technicienService.get_all()
            if techniciens is None or len(techniciens) == 0:
                raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Aucuns techniciens trouvés")
            return techniciens

        @self.router.get("/recherche", )
        async def get_by_filtres(nom: str, prenom: str):
            tecnicien = await self.__technicienService.get_by_filtres(nom, prenom)
            if tecnicien is None:
                raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Technicien non trouvé")
            return tecnicien

        @self.router.get("/{id}", response_model=Technicien)
        async def get_by_id(id: int):
            technicien = await self.__technicienService.get_by_id(id)
            if technicien is None:
                raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Aucun technicien trouvé")
            return technicien

        @self.router.post("/", response_model=Technicien)
        async def create_technicien(technicienCreate: TechnicienCreate):
            technicienExistant = await self.__technicienService.get_by_filtres(technicienCreate.nom, technicienCreate.prenom)
            if technicienExistant is not None:
                raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Technicien existant")
            technicien = await self.__technicienService.add(Technicien(**technicienCreate.model_dump()))
            if technicien is None:
                raise HTTPException(
                    status_code=HTTPStatus.BAD_REQUEST,
                    detail="Erreur de création d'un nouveau technicien")
            return technicien

        @self.router.put("/{id}/actif")
        async def update_status(id: int, actif: bool):
            technicien = await self.__technicienService.update_status(id, actif)
            if technicien is None:
                raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="Technicien non présent")
            return technicien

        @self.router.put("/{id}")
        async def update(id: int, technicienCreate: TechnicienCreate):
            technicien = await self.__technicienService.update(id, Technicien(**technicienCreate.model_dump()))
            if technicien is None:
                raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="Technicien non présent")
            return technicien

        @self.router.delete("/all", response_class=JSONResponse)
        async def delete_all():
            status = await self.__technicienService.delete_all()
            if status is True:
                return Response(status_code=HTTPStatus.OK)
            else:
                return JSONResponse(status_code=HTTPStatus.BAD_REQUEST,
                                    content={"message": "Aucuns technicien présents"})

        @self.router.delete("/{id}", response_class=JSONResponse)
        async def delete_technicien(id: int):
            status = await self.__technicienService.delete_by_id(id)
            if status is True:
                return Response(status_code=HTTPStatus.OK)
            else:
                return JSONResponse(status_code=HTTPStatus.BAD_REQUEST, content={"message": "Technicien non trouvé"})