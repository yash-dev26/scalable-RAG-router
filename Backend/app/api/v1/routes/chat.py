from fastapi import APIRouter, Request

from app.schemas.request import ChatRequest
from app.service.chatService import process_chat

router = APIRouter()

@router.post("/")
async def chat(payload: ChatRequest, request: Request):
    result = await process_chat(payload, request.app.state.graph)
    return result

