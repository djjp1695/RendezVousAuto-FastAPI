from sqlmodel import SQLModel, Field

class RendezVous(SQLModel):
    __tablename__ = "rendez_vous"

    id: int | None = Field(default=None, primary_key=True)
    technicien_id: int | None = Field(default=None, foreign_key='technicien.id')
    voiture_id: int | None = Field(default=None, foreign_key='voiture.id')
    date_heure: str
