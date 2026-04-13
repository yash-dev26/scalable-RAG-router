from typing import Optional, List, Literal
from pydantic import BaseModel, Field
from langgraph.graph import add_messages
from typing_extensions import Annotated


class GraphState(BaseModel):
    # ---------------------------------------------------
    # 🔹 User Input
    # ---------------------------------------------------
    user_id: str
    query: str
    file_id: Optional[str] = None

    # ---------------------------------------------------
    # 🔹 Query Processing
    # ---------------------------------------------------
    rewritten_query: Optional[str] = None
    queries: Optional[List[str]] = None   # 🔥 for multi-rewrite

    intent: Optional[Literal["rag", "llm"]] = None
    rewrite_type: Optional[Literal["none", "single", "multi"]] = None

    # ---------------------------------------------------
    # 🔹 Retrieval Output
    # ---------------------------------------------------
    context: Optional[List[str]] = None   # final docs (after RRF / rerank)
    scores: Optional[List[float]] = None  # 🔥 CLEAN similarity scores

    # (optional but powerful)
    rrf_scores: Optional[List[float]] = None  # debugging / advanced tuning

    # ---------------------------------------------------
    # 🔹 Conversation / LLM
    # ---------------------------------------------------
    messages: Annotated[List, add_messages] = Field(default_factory=list)
    response: Optional[str] = None

    # ---------------------------------------------------
    # 🔹 Control Flags (optional)
    # ---------------------------------------------------
    confidence: Optional[float] = None