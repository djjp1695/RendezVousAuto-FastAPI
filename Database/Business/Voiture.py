from sqlmodel import SQLModel, Field

class Voiture(SQLModel):
    id: int | None = Field(primary_key=True, autoincrement=True, )
