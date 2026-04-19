from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.schemas.request import ChatRequest
from app.service.chatService import process_chat, stream_chat_events

router = APIRouter()

@router.post("/")
async def chat(payload: ChatRequest, request: Request):
    result = await process_chat(payload, request.app.state.graph)
    return result


@router.post("/stream")
async def chat_stream(payload: ChatRequest, request: Request):
    return StreamingResponse(
        stream_chat_events(payload, request.app.state.graph),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

