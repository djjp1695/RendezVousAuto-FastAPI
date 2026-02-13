from pydantic import BaseModel
from sqlmodel import SQLModel, Field

class Technicien(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nom: str
    prenom: str
    actif: bool


class TechnicienCreate(BaseModel):
    nom: str
    prenom: str
    actif: bool = True