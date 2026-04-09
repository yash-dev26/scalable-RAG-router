from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def ingest():
    return {"message": "Hello from the ingest endpoint!"}