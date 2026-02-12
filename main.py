from Database.Services.RendezVousService import RendezVousService
from Database.Services.VoitureService import VoitureService
from Routes.RendezVousRouter import create_rendezvous_router
from Routes.VoitureRouter import create_voiture_router

DB_FILENAME = './Database/db.sqlite'

import uvicorn
from fastapi import FastAPI, Request
from starlette.responses import HTMLResponse, JSONResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from Database.DbContext import DbContext
from Routes.TechnicienRouter import TechnicienRouter

dbContext = DbContext(DB_FILENAME)
voitureService = VoitureService(dbContext)
rendezVousService = RendezVousService(dbContext)
app = FastAPI()
app.include_router(create_rendezvous_router(rendezVousService))
app.include_router(TechnicienRouter)
app.include_router(create_voiture_router(voitureService))

app.mount("/static", StaticFiles(directory="www/static"), name="static")
templates = Jinja2Templates(directory="www/templates")


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")
