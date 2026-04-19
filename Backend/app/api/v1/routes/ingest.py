from uuid import uuid4
from pathlib import Path
import hashlib
from app.schemas.request import IngestRequest
from app.service.ingestService import ingest_data
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

router = APIRouter()

@router.post("/")
async def ingest(
    user_id: str = Form(...),
    file: UploadFile = File(...),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    suffix = Path(file.filename).suffix.lower()
    if suffix != ".pdf":
        raise HTTPException(status_code=400, detail="Only PDF uploads are supported")

    file_id = str(uuid4())
    upload_dir = Path(__file__).resolve().parents[4] / "uploaded_files"
    upload_dir.mkdir(parents=True, exist_ok=True)
    stored_path = upload_dir / f"{file_id}{suffix}"

    content = await file.read()
    content_hash = hashlib.sha256(content).hexdigest()
    stored_path.write_bytes(content)

    try:
        ingest_result = await ingest_data(
            IngestRequest(
                user_id=user_id,
                file_id=file_id,
                file_path=str(stored_path),
                content_hash=content_hash,
            )
        )
    finally:
        if stored_path.exists():
            stored_path.unlink()

    return {
        "file_id": ingest_result.get("file_id", file_id),
        "filename": file.filename,
        "message": ingest_result.get("message", "Ingested successfully"),
        "duplicate": ingest_result.get("duplicate", False),
    }