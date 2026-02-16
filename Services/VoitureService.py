from typing import List

from sqlalchemy.orm import selectinload
from sqlmodel import select, delete

from Models.RendezVous import RendezVous
from Models.Voiture import Voiture


class VoitureService:
    def __init__(self, context):
        self.__context = context

    async def get_all(self) -> List[Voiture]:
        async with self.__context.get_session() as session:
            return (await session.scalars(
                select(Voiture)
                .options(
                    selectinload(Voiture.rendez_vous)
                    .selectinload(RendezVous.technicien)
                )
            )
                    ).all()

    async def get_by_id(self, id: int) -> Voiture:
        async with self.__context.get_session() as session:
            return await session.get(Voiture, id)

    async def get_by_filtres(self, marque: str, annee: int, modele: str, couleur: str):
        async with self.__context.get_session() as session:
            return (await session.scalars(
                select(Voiture)
                .where(Voiture.marque.ilike(marque))
                .where(Voiture.annee == annee)
                .where(Voiture.modele.ilike(modele))
                .where(Voiture.couleur.ilike(couleur))
            )).first()

    async def add(self, voiture: Voiture) -> Voiture:
        async with self.__context.get_session() as session:
            async with session.begin():
                session.add(voiture)
        return voiture

    async def update_status(self, id: int, actif: bool) -> Voiture:
        async with self.__context.get_session() as session:
            async with session.begin():
                voiture = await session.get(Voiture, id)
                if voiture is None:
                    return None
                voiture.actif = actif
        return voiture

    async def update(self, id, newVoiture: Voiture) -> Voiture:
        async with self.__context.get_session() as session:
            async with session.begin():
                voiture = await session.get(Voiture, id)
                if voiture is None:
                    return None
                voiture.modele = newVoiture.modele
                voiture.couleur = newVoiture.couleur
                voiture.marque = newVoiture.marque
                voiture.annee = newVoiture.annee
                voiture.actif = newVoiture.actif
        return voiture

    async def delete_by_id(self, id: int) -> dict:
        async with self.__context.get_session() as session:
            async with session.begin():
                voiture = await session.get(Voiture, id)
                if voiture is None:
                    return False
                await session.delete(voiture)
                return True

    async def delete_all(self):
        async with self.__context.get_session() as session:
            async with session.begin():
                return (await session.execute(delete(Voiture))).rowcount > 0
