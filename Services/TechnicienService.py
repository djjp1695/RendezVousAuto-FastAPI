from sqlmodel import select, delete
from Models.Technicien import Technicien

class TechnicienService:
    def __init__(self, context):
        self.context = context

    async def get_all(self):
        async with self.context.get_session() as session:
            return (await session.scalars(select(Technicien))).all()

    async def get_by_id(self, id):
        async with self.context.get_session() as session:
            return await session.get(Technicien, id)

    async def add(self, technicien: Technicien):
        async with self.context.get_session() as session:
            async with session.begin():
                session.add(technicien)
            return technicien

    async def update_status(self, id : int, actif:bool):
        async with self.context.get_session() as session:
            async with session.begin():
                technicien = await session.get(Technicien, id)
                if technicien is None:
                   return False
                technicien.actif = actif
            return technicien

    async def delete_by_id(self, id):
        async with self.context.get_session() as session:
            async with session.begin():
                technicien= await session.get(Technicien, id)
                if technicien is None:
                    return False
                await session.delete(technicien)
                return True

    async def update_technicien(self, id, technicien:Technicien):
        async with self.context.get_session() as session:
            async with session.begin():
                technicien = await session.get(Technicien, id)
                if technicien is None:
                    return False
                technicien.nom= technicien.nom
                technicien.prenom = technicien.prenom
                technicien.actif = technicien.actif
            return technicien

    async def delete_all(self):
        async with self.context.get_session() as session:
            async with session.begin():
                await session.execute(delete(Technicien))
                return True



