from fastapi import FastAPI, Request
from starlette.responses import HTMLResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from Models.DbContext import DbContext
from Routes.RessourcesRouter import create_ressources_router
from Services.RendezVousService import RendezVousService
from Services.RessourcesService import RessourceService
from Services.TechnicienService import TechnicienService
from Services.VoitureService import VoitureService

from Routes.RendezVousRouter import create_rendezvous_router
from Routes.TechnicienRouter import create_technicien_router
from Routes.VoitureRouter import create_voiture_router

DB_FILENAME = './Database/db.sqlite'

dbContext = DbContext(DB_FILENAME)
app = FastAPI()
app.include_router(create_voiture_router(VoitureService(dbContext)))
app.include_router(create_rendezvous_router(RendezVousService(dbContext)))
app.include_router(create_technicien_router(TechnicienService(dbContext)))
app.include_router(create_ressources_router(RessourceService()))


app.mount("/static", StaticFiles(directory="www/static"), name="static")
templates = Jinja2Templates(directory="www/templates")


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")
