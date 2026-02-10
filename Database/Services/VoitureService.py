from sqlalchemy import select

from Database.Business.Voiture import Voiture


class VoitureService:
    def __init__(self, context):
        self.__context = context

    async def get_all_voitures(self):
        async with self.__context.get_session() as session:
            return (await session.execute(select(Voiture))).scalars().all()

    async def get_voiture_by_id(self, id):
        async with self.__context.get_session() as session:
            return (await session.execute(select(Voiture).where(Voiture.id == id))).scalar_one_or_none()
