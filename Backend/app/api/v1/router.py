from fastapi import APIRouter

from app.api.v1.routes import health, ingest, chat

router = APIRouter()

router.include_router(prefix="/ingest", router=ingest.router)
router.include_router(prefix="/chat", router=chat.router)
router.include_router(prefix="/health", router=health.router)