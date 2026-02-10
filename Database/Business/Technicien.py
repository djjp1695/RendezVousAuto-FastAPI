from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Technicien(Base, table=True):
    id: Column(Integer, primary_key=True, autoincrement=True)
    nom: Column(String)
    prenom: Column(String)
    actif: Column(Integer)
