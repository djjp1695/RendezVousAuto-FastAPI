from sqlalchemy import Integer, true, ForeignKey, String, Column
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class RendezVous(Base):
    __tablename__ = "rendez_vous"
    __allow_unmapped = True
    id: Column('id', Integer, primary_key=True, autoincrement=True)
    technicien_id: Column('technicien_id', Integer, ForeignKey('technicien.id'))
    voiture_id: int = Column('voiture_id', Integer, ForeignKey('voiture.id'))
    date_heure: Column('date_heure', String)
