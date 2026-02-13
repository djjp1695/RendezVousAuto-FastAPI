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

    async def update_status(self, id: int, actif: bool):
        async with self.context.get_session() as session:
            async with session.begin():
                technicien = await session.get(Technicien, id)
                if technicien is None:
                    return None
                technicien.actif = actif
            return technicien

    async def delete_by_id(self, id):
        async with self.context.get_session() as session:
            async with session.begin():
                technicien = await session.get(Technicien, id)
                if technicien is None:
                    return False
                await session.delete(technicien)
                return True

    async def get_by_filtres(self, nom, prenom):
        async with (self.context.get_session() as session):
            return (await session.scalars(select(Technicien)
                                         .where(Technicien.nom.ilike(nom))
                                         .where(Technicien.prenom.ilike(prenom))
                                         )).first()

    async def update(self, id, newTechnicien: Technicien):
        async with self.context.get_session() as session:
            async with session.begin():
                technicien = await session.get(Technicien, id)
                if technicien is None:
                    return None
                technicien.nom = newTechnicien.nom
                technicien.prenom = newTechnicien.prenom
                technicien.actif = newTechnicien.actif
            return technicien

    async def delete_all(self):
        async with self.context.get_session() as session:
            async with session.begin():
                return (await session.execute(delete(Technicien))).rowcount > 0
