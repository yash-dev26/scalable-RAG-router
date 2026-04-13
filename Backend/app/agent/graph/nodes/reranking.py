from app.schemas.state import GraphState
from sentence_transformers import CrossEncoder

# just load once not per request so keep it global
reranker_model = CrossEncoder("BAAI/bge-reranker-small", max_length=512)


def reranking_node(state: GraphState):
    query = state.rewritten_query or state.query
    docs = state.context or []

    if not docs:
        return state

    # ---------------------------------------------------
    # 🔹 Prepare (query, doc) pairs
    # ---------------------------------------------------
    pairs = [(query, doc) for doc in docs]

    # ---------------------------------------------------
    # 🔹 Get relevance scores
    # ---------------------------------------------------
    scores = reranker_model.predict(pairs)

    # ---------------------------------------------------
    # 🔹 Combine + sort
    # ---------------------------------------------------
    scored_docs = list(zip(docs, scores))
    ranked = sorted(scored_docs, key=lambda x: x[1], reverse=True)

    # ---------------------------------------------------
    # 🔹 Select top-k
    # ---------------------------------------------------
    top_docs = [doc for doc, _ in ranked[:4]]

    return {
        "context": top_docs
    }