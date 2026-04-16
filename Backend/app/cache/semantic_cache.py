import json
import time
import uuid
import numpy as np
from uuid import uuid4

from app.config.redis import redis_client
from app.ingestion.embeddings import gen_embeddings
from app.repository.qdrant import qdrant_client
from app.config.server import config


SIMILARITY_THRESHOLD = 0.82  # tune later


def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


from app.repository.qdrant import qdrant_client

def get_semantic_cached_response(query: str, user_id: str, file_id: str | None):
    query_embedding = gen_embeddings(query)
    current_time = int(time.time())

    results = qdrant_client.query_points(
        collection_name=config["semantic_cache_collection_name"],
        query=query_embedding,
        query_filter={
            "must": [
                {"key": "user_id", "match": {"value": user_id}},
                {"key": "file_id", "match": {"value": file_id}},
                {
                "key": "expires_at",
                "range": {"gte": current_time}
                }
            ]
        },
        limit=1
    ).points

    if not results:
        return None

    top = results[0]

    print(f"[semantic debug] sim={top.score:.3f} | cached='{top.payload.get('query')}'")

    if top.score > SIMILARITY_THRESHOLD:
        print(f"[semantic cache] HIT ({top.score:.3f})")
        return top.payload.get("response")

    print(f"[semantic cache] MISS ({top.score:.3f})")
    return None


def set_semantic_cache(query, response, user_id, file_id):
    embedding = gen_embeddings(query)
    now = int(time.time())
    ttl = 36000

    qdrant_client.upsert(
        collection_name=config["semantic_cache_collection_name"],
        points=[
            {
                "id": str(uuid4()),
                "vector": embedding,
                "payload": {
                    "query": query,
                    "response": response,
                    "user_id": user_id,
                    "file_id": file_id,
                    "created_at": now,
                    "expires_at": now + ttl
                }
            }
        ]
    )