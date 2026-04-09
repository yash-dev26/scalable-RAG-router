from fastapi import APIRouter

from app.schemas.request import ChatRequest

router = APIRouter()

@router.post("/")
async def chat(request: ChatRequest):
    return {"response": "Hello from the chat endpoint!"}

