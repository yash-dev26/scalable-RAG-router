from app.schemas.state import GraphState

def route_after_single_rewrite(state: GraphState):
        if state.intent == "rag":
            return "retrieve"
        return "llm"