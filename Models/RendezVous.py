from datetime import datetime

from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship

from Models.Technicien import TechnicienOut
from Models.Voiture import VoitureOut


class RendezVous(SQLModel, table=True):
    __tablename__ = "rendez_vous"
    id: int = Field(default=None, primary_key=True)
    technicien_id: int = Field(foreign_key="technicien.id")
    technicien: "Technicien" = Relationship(back_populates="rendez_vous")
    voiture_id: int = Field(foreign_key="voiture.id")
    voiture: "Voiture" = Relationship(back_populates="rendez_vous")
    date_heure: datetime


class RendezVousOut(BaseModel):
    id: int
    technicien: TechnicienOut
    voiture: VoitureOut
    date_heure: datetime
