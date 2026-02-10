from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Voiture(Base):
    __tablename__ = "voiture"
    id = Column(Integer, primary_key=True, autoincrement=True)
    modele = Column(String)
    annee = Column(Integer)
    couleur = Column(String)

    def to_dict(self):
        return {
            'id': self.id,
            'modele': self.modele,
            'annee': self.annee,
            'couleur': self.couleur
        }
