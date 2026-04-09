from fastapi import APIRouter

from app.schemas.request import IngestRequest

router = APIRouter()

@router.post("/")
async def ingest(request: IngestRequest):
    return {
        "document_id": request.document_id,
        "status": "Ingestion successful"
    }