from pydantic import BaseModel

class ChatRequest(BaseModel):
    user_id: str
    query: str

class IngestRequest(BaseModel):
    document_id: str
    User_id: str
    