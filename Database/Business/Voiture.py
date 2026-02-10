from sqlalchemy.ext.declarative import declarative_base
from sqlmodel import SQLModel, Field
from typing import Annotated

Base = declarative_base()


class Voiture(SQLModel):
    id: int | None = Field(primary_key=True, autoincrement=True, )
