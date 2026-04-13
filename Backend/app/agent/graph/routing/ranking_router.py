from app.agent.graph.graphBuilder import GraphState

def ranking_decision_node(state: GraphState):
    scores = state.scores or []
    docs = state.context or []

    if len(docs) <= 3:
        return "skip_rerank"

    if len(scores) >= 2 and (scores[0] - scores[1] > 0.15):
        return "skip_rerank"

    if state.rewrite_type == "multi":
        return "do_rerank"

    return "do_rerank"