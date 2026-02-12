from sqlmodel import SQLModel, Field


class Voiture(SQLModel, table=True):
    __tablename__ = "voiture"
    id : int | None = Field(default=None, primary_key=True)
    modele : str
    annee : int
    couleur : str