import uvicorn
from fastapi import FastAPI, Request
from starlette.responses import HTMLResponse, JSONResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from Routes.RendezVousRouter import RendezVousRouter
from Routes.TechnicienRouter import TechnicienRouter
from Routes.VoitureRouter import VoitureRouter

app = FastAPI()
app.include_router(RendezVousRouter)
app.include_router(TechnicienRouter)
app.include_router(VoitureRouter)

app.mount("/static", StaticFiles(directory="www/static"), name="static")
templates = Jinja2Templates(directory="www/templates")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")
