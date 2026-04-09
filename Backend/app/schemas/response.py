from pydantic import BaseModel

class ChatResponse(BaseModel):
    response: str

class IngestResponse(BaseModel):
    document_id: str
    status: str