import time
import asyncio
from app.config.qdrantConfig import qdrant_client

SEMANTIC_CACHE_COLLECTION = "semantic-cache"

async def cleanup_semantic_cache(interval: int = 600):  # every 10 mins
    while True:
        try:
            current_time = int(time.time())

            print("[cleanup] running semantic cache cleanup...")

            qdrant_client.delete(
                collection_name=SEMANTIC_CACHE_COLLECTION,
                points_selector={
                    "filter": {
                        "must": [
                            {
                                "key": "expires_at",
                                "range": {"lt": current_time}
                            }
                        ]
                    }
                }
            )

            print("[cleanup] done")

        except Exception as e:
            print(f"[cleanup] error: {e}")

        await asyncio.sleep(interval)