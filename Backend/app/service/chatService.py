from app.schemas.request import ChatRequest
from app.schemas.state import GraphState

from uuid import uuid4

def _resolve_thread_id(request: ChatRequest) -> str:
    if request.thread_id:
        return request.thread_id

    if request.file_id:
        return f"{request.user_id}:{request.file_id}"

    return f"{request.user_id}:{uuid4()}"

async def process_chat(request: ChatRequest, graph):
    thread_id = _resolve_thread_id(request)

    state = GraphState(
        user_id=request.user_id,
        query=request.query,
        file_id=request.file_id if request.file_id else None
    )

    invoke_config = {
        "configurable": {
            "thread_id": thread_id
        }
    }

    result = (
        graph.invoke(state, config=invoke_config)
        if graph
        else None
    )

    if isinstance(result, dict):
        return {
            "response": result.get("response") or "I could not generate a response right now.",
            "thread_id": thread_id,
        }

    return {
        "response": getattr(result, "response", None) or "I could not generate a response right now.",
        "thread_id": thread_id,
    }