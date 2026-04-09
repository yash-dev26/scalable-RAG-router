from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def chat():
    return {"message": "Hello from the chat endpoint!"}

