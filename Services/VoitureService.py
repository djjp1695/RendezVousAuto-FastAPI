from typing import Optional, List

from sqlmodel import select, delete
from sqlmodel.ext.asyncio.session import AsyncSession

from Models.Voiture import Voiture


class VoitureService:
    def __init__(self, context):
        self.__context = context

    async def get_all_voitures(self) -> Optional[List[Voiture]]:
        async with self.__context.get_session() as session:
            result = await session.execute(select(Voiture))
            voitures = result.scalars().all()
            return None if len(voitures) == 0 else voitures

    async def get_voiture_by_id(self, id: int) -> Optional[Voiture]:
        async with self.__context.get_session() as session:
            result = await session.execute(
                select(Voiture).where(Voiture.id == id)
            )
            return result.scalar_one_or_none()

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
                await session.refresh(voiture)
        return voiture

    async def update_voiture_status(self, id: int, actif: bool) -> Optional[Voiture]:
        async with self.__context.get_session() as session:
            async with session.begin():
                result = await session.execute(
                    select(Voiture).where(Voiture.id == id)
                )
                voiture = result.scalar_one_or_none()

                if voiture is None:
                    return None

                voiture.actif = actif
                session.add(voiture)
                await session.refresh(voiture)

        return voiture

    async def delete_voiture_by_id(self, id: int) -> bool:
        async with self.__context.get_session() as session:
            async with session.begin():
                result = await session.execute(delete(Voiture).where(Voiture.id == id))
                return result.rowcount > 0
