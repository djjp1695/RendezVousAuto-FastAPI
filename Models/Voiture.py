from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship

from Models.RendezVous import RendezVousOut


class Voiture(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    marque: str
    modele: str
    annee: int
    couleur: str
    actif: bool = Field(default=True)
    rendez_vous: list["RendezVous"] = Relationship(back_populates="voiture", sa_relationship_kwargs={"lazy": "selectin"})


class VoitureOut(BaseModel):
    id: int
    marque: str
    modele: str
    annee: int
    couleur: str
    actif: bool
    rendez_vous: list[RendezVousOut]


class VoitureCreate(BaseModel):
    marque: str
    modele: str
    annee: int
    couleur: str
    actif: bool = True
