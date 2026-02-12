from sqlmodel import select

from Models.RendezVous import RendezVous

class RendezVousService:
    def __init__(self, context):
        self.__context = context

    async def get_all_rendezVous(self):
        async with self.__context.get_session() as session:
            return (await session.execute(select(RendezVous))).scalars().all()

    async def get_rendezVous_by_id(self, id):
        async with self.__context.get_session() as session:
            return (await session.execute(select(RendezVous).where(RendezVous.id == id))).scalar_one_or_none()
