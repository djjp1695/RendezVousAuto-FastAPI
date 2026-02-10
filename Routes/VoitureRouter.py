from fastapi import APIRouter
from starlette.responses import HTMLResponse, JSONResponse

VoitureRouter = APIRouter()
NAME = "VoitureRouter"
@VoitureRouter.get(f"/{NAME}", response_class=JSONResponse)
async def main():
    return {f"route : {NAME}"}
