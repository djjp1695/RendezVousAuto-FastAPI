from typing import Optional, List

from sqlmodel import select

from Models.Voiture import Voiture


class VoitureService:
    def __init__(self, context):
        self.__context = context

    async def get_all_voitures(self) -> List[Voiture]:
        async with self.__context.get_session() as session:
            return (await session.scalars(select(Voiture))).all()

    async def get_voiture_by_id(self, id: int) -> Voiture:
        async with self.__context.get_session() as session:
            return await session.get(Voiture, id)

    async def get_voiture_filtres(
            self, marque: str, annee: int, modele: str, couleur: str
    ) -> Optional[Voiture]:
        async with self.__context.get_session() as session:
            result = await session.execute(
                select(Voiture)
                .where(Voiture.marque == marque)
                .where(Voiture.annee == annee)
                .where(Voiture.modele == modele)
                .where(Voiture.couleur == couleur)
            )
            return result.scalars().first()

    async def add_voiture(self, voiture: Voiture) -> Voiture:
        async with self.__context.get_session() as session:
            async with session.begin():
                session.add(voiture)
        return voiture

    async def update_voiture_status(self, id: int, actif: bool) -> Voiture:
        async with self.__context.get_session() as session:
            async with session.begin():
                voiture = await session.get(Voiture, id)
                if voiture is None:
                    return None
                voiture.actif = actif
        return voiture

    async def delete_voiture_by_id(self, id: int) -> bool:
        async with self.__context.get_session() as session:
            async with session.begin():
                voiture = await session.get(Voiture, id)
                if voiture is None:
                    return False
                await session.delete(voiture)
                return True
