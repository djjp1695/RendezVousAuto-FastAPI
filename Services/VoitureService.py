from typing import List

from sqlmodel import select, delete

from Models.Voiture import Voiture


class VoitureService:
    def __init__(self, context):
        self.__context = context

    async def get_all(self) -> List[Voiture]:
        async with self.__context.get_session() as session:
            return (await session.scalars(select(Voiture))).all()

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
            )).one_or_none()

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

    async def update(self, id, voiture: Voiture) -> Voiture:
        async with self.__context.get_session() as session:
            async with session.begin():
                newVoiture = await session.get(Voiture, id)
                if newVoiture is None:
                    return None
                newVoiture.modele = voiture.modele
                newVoiture.couleur = voiture.couleur
                newVoiture.marque = voiture.marque
                newVoiture.annee = voiture.annee
                newVoiture.actif = voiture.actif
        return newVoiture

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
                result = await session.execute(delete(Voiture))
                return result.rowcount > 0
