from app.schemas.state import GraphState


def needs_retrieval(query: str) -> bool:
    """
    Cheap heuristic: does this query even need a document lookup?
    Returns False for obvious general-knowledge / chitchat queries so we can
    skip retrieval entirely and go straight to the LLM node.
    """
    greetings = {"hi", "hello", "hey", "thanks", "thank you", "bye", "ok", "okay" }
    return query.strip().lower() not in greetings

def pre_retrieval_planner_node(state: GraphState) -> dict:
    print("[flow] entering pre_retrieval_planner_node")
    query = state.query.strip().lower()
    words = query.split()

    if not needs_retrieval(query):
        return {"intent": "llm", "rewrite_type": "none"}

    if not state.file_id:
        return {"intent": "llm", "rewrite_type": "none"}

    if len(words) <= 3:
        return {"intent": "rag", "rewrite_type": "none"}

    if _is_ambiguous(query):
        return {"intent": "rag", "rewrite_type": "single"}

    return {"intent": "rag", "rewrite_type": "none"}


def _is_ambiguous(query: str) -> bool:
    ambiguous_signals = {"it", "this", "that", "they", "he", "she", "the thing", "stuff"}
    words = set(query.lower().split())
    return bool(words & ambiguous_signals)


