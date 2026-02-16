from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship


class Technicien(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    nom: str
    prenom: str
    actif: bool
    rendez_vous: list["RendezVous"] = Relationship(back_populates="technicien")


class TechnicienOut(BaseModel):
    id: int
    nom: str
    prenom: str
    actif: bool


class TechnicienCreate(BaseModel):
    nom: str
    prenom: str
    actif: bool = True
