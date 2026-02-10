from fastapi import APIRouter
from starlette.responses import HTMLResponse, JSONResponse

RendezVousRouter = APIRouter()
NAME = 'RendezVous'

@RendezVousRouter.get(f"/{NAME}", response_class=JSONResponse)
async def main():
    return {"Routeur": "RendezVousRoute"}

