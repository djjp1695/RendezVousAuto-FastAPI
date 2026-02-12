from sqlmodel import SQLModel, Field

class Technicien(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    nom: str
    prenom: str
    actif: int
