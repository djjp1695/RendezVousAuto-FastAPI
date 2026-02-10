from fastapi import APIRouter
from starlette.responses import JSONResponse

TechnicienRouter = APIRouter()
NAME = 'TechnicienRouter'

@TechnicienRouter.get(f"/{NAME}", response_class=JSONResponse)
async def main():
    return {f"Route : {NAME}"}
