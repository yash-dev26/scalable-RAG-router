from app.ingestion.embeddings import gen_embeddings
from app.repository.qdrant import search_data


def retrieve_relevant_documents(query: str, top_k: int = 5):

    embedding = gen_embeddings(query)
    results = search_data(
        collection_name="rag-collection",
        query_vector=embedding,
        top_k=top_k
    )

    text = [hit.payload.get("text", "") for hit in results]
    scores = [hit.score for hit in results]

    documents = []
    for t, s in zip(text, scores):
        documents.append({"text": t, "score": s})
    return documents