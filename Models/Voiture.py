from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class Voiture(SQLModel, table=True):
    __tablename__ = "voiture"
    id: int | None = Field(default=None, primary_key=True)
    marque: str = Field(nullable=False)
    modele: str = Field(nullable=False)
    annee: int = Field(nullable=False)
    couleur: str = Field(nullable=False)
    actif: bool = Field(default=True, nullable=False)


class VoitureCreate(BaseModel):
    marque: str
    modele: str
    annee: int
    couleur: str
    actif: bool = True