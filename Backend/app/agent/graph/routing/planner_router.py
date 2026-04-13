def route_after_planner(state):
    if state.intent == "llm" and state.confidence > 0.85:
        return "llm"
    if state.rewrite_type == "single":
        return "single-rewrite"
    if state.rewrite_type == "multi":
        return "multi-rewrite"
    if state.intent == "rag":
        return "retrieve"
    return "llm"