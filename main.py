from fastapi import FastAPI, Request
from starlette.responses import HTMLResponse, JSONResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from starlette.exceptions import HTTPException as StarletteHTTPException

from Models.DbContext import DbContext
from Routes.RessourcesRouter import RessourcesRouter
from Services.RendezVousService import RendezVousService
from Services.RessourcesService import RessourceService
from Services.TechnicienService import TechnicienService
from Services.VoitureService import VoitureService

from Routes.RendezVousRouter import RendezVousRouter
from Routes.TechnicienRouter import TechnicienRouter
from Routes.VoitureRouter import VoitureRouter

DB_FILENAME = './Database/db.sqlite'
RESSOURCE_FILENAME = 'Ressources/ressources.json'
API_LINK = "/api"

dbContext = DbContext(DB_FILENAME)
app = FastAPI()
app.include_router(VoitureRouter(VoitureService(dbContext), API_LINK).router)
app.include_router(RendezVousRouter(RendezVousService(dbContext), API_LINK).router)
app.include_router(TechnicienRouter(TechnicienService(dbContext), API_LINK).router)
app.include_router(RessourcesRouter(RessourceService(RESSOURCE_FILENAME), API_LINK).router)

app.mount("/static", StaticFiles(directory="www/static"), name="static")
templates = Jinja2Templates(directory="www/templates")


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")


@app.exception_handler(StarletteHTTPException)
async def unicorn_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404 and API_LINK not in request.url.path:  # pass to frontend
        return templates.TemplateResponse("index.html", {"request": request, "initial_status_code": 404},
                                          status_code=404)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
