from app.schemas.state import GraphState
from app.retrieval.retrieval import retrieve_relevant_documents


def reciprocal_rank_fusion(rankings, k=20):
    scores = {}

    for ranking in rankings:
        for rank, doc in enumerate(ranking):
            doc_id = hash(doc["text"])

            if doc_id not in scores:
                scores[doc_id] = {
                    "doc": doc,
                    "rrf_score": 0.0
                }

            scores[doc_id]["rrf_score"] += 1 / (k + rank + 1)

    # sort by score
    ranked = sorted(scores.values(), key=lambda x: x["rrf_score"], reverse=True)

    return [
        {
            "text": item["doc"]["text"],
            "qdrant_score": item["doc"]["score"],
            "rrf_score": item["rrf_score"]
        }
        for item in ranked
    ]


def retrieve_node(state: GraphState):

    base_query = state.rewritten_query or state.query

    queries = []

    if state.rewrite_type == "multi" and hasattr(state, "queries"):
        queries = state.queries or []
    else:
        queries = [base_query]

    all_rankings = []

    for q in queries:
        docs = retrieve_relevant_documents(q, top_k=5)
        all_rankings.append(docs)

    if not all_rankings:
        fused_docs = []
    elif len(all_rankings) > 1:  # multiple rewrites -> fuse
        fused_docs = reciprocal_rank_fusion(all_rankings)
    else:
        fused_docs = [
            {
                "text": doc["text"],
                "qdrant_score": doc["score"],
                "rrf_score": None
            }
            for doc in all_rankings[0]
        ]

    final_docs = fused_docs[:8]  # slightly larger pool for reranking

    return {
        "context": [doc["text"] for doc in final_docs],
        "scores": [doc["qdrant_score"] for doc in final_docs],
        "rrf_scores": [doc["rrf_score"] for doc in final_docs]
    }