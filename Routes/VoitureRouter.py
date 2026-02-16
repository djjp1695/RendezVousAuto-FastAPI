from http import HTTPStatus

from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse, Response

from Models.Voiture import Voiture, VoitureCreate, VoitureOut
from Services.VoitureService import VoitureService

ROUTER_NAME = "Voitures"

class VoitureRouter():
    def __init__(self, voitureService: VoitureService, apilink):
        self.__voiture_service = voitureService
        self.router = APIRouter(prefix=f"{apilink}/{ROUTER_NAME}")

        self.ajouter_routes();

    def ajouter_routes(self):
        @self.router.get("/", response_model=list[VoitureOut])
        async def voitures():
            voitures = await self.__voiture_service.get_all()
            if not voitures:
                raise HTTPException(
                    status_code=HTTPStatus.NOT_FOUND,
                    detail="Aucune voiture présente"
                )
            print(voitures[0].rendez_vous)
            return voitures

        @self.router.get("/recherche")
        async def voiture_marque_annee_modele_couleur(
                marque: str,
                annee: int,
                modele: str,
                couleur: str
        ):
            voiture = await self.__voiture_service.get_by_filtres(
                marque, annee, modele, couleur
            )
            if voiture is None:
                raise HTTPException(
                    status_code=HTTPStatus.NOT_FOUND,
                    detail="Voiture not found"
                )
            return voiture

        @self.router.get("/{id}", response_model=Voiture)
        async def voiture_by_id(id: int):
            voiture = await self.__voiture_service.get_by_id(id)
            if not voiture:
                raise HTTPException(
                    status_code=HTTPStatus.NOT_FOUND,
                    detail="Voiture not found"
                )
            return voiture

        @self.router.delete("/all")
        async def delete_all():
            status = await self.__voiture_service.delete_all()
            if status:
                return Response(status_code=HTTPStatus.OK)
            else:
                return JSONResponse(status_code=HTTPStatus.BAD_REQUEST,
                                    content={"message": "Aucunes voitures présentes"})

        @self.router.delete("/{id}", response_class=JSONResponse)
        async def delete_voiture(id: int):
            status = await self.__voiture_service.delete_by_id(id)
            if status:
                return Response(status_code=HTTPStatus.OK)
            else:
                return JSONResponse(status_code=HTTPStatus.BAD_REQUEST, content={"message": "Voiture not present"})

        @self.router.put("/{id}")
        async def update_voiture(id: int, VoitureUpdate: VoitureCreate):
            voiture = await self.__voiture_service.update(id, Voiture(**VoitureUpdate.model_dump()))
            if voiture is None:
                raise HTTPException(
                    status_code=HTTPStatus.NOT_FOUND,
                    detail="Voiture not present"
                )
            return voiture

        @self.router.put("/{id}/status", response_model=Voiture)
        async def update_status(id: int, actif: bool):
            voiture = await self.__voiture_service.update_status(id, actif)
            if voiture is None:
                raise HTTPException(
                    status_code=HTTPStatus.NOT_FOUND,
                    detail="Voiture not present"
                )
            return voiture

        @self.router.post("/", response_model=Voiture)
        async def add_voiture(voitureCreate: VoitureCreate):
            voitureExistante = await self.__voiture_service.get_by_filtres(voitureCreate.marque, voitureCreate.annee,
                                                                    voitureCreate.modele, voitureCreate.couleur)
            if voitureExistante is not None:
                raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Voiture existante")

            voiture = await (self.__voiture_service.add
                (
                Voiture(**voitureCreate.model_dump())
            ))
            if voiture is None:
                raise HTTPException(
                    status_code=HTTPStatus.BAD_REQUEST,
                    detail="Erreur de création d'une nouvelle voiture"
                )
            return voiture
