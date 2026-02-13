from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship


class Voiture(SQLModel, table=True):
    __tablename__ = "voiture"
    id: int = Field(default=None, primary_key=True)
    marque: str
    modele: str
    annee: int
    couleur: str
    actif: bool = Field(default=True)
    rendez_vous: list["RendezVous"] = Relationship(back_populates="voiture")

class VoitureCreate(BaseModel):
    marque: str
    modele: str
    annee: int
    couleur: str
    actif: bool = True