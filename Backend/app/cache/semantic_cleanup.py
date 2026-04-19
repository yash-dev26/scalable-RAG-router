import asyncio
import time

from qdrant_client.http.models import FieldCondition, Filter, Range

from app.config.qdrantConfig import qdrant_client
from app.config.server import config


async def cleanup_semantic_cache(interval: int = 600):
    while True:
        try:
            current_time = int(time.time())

            print("[cleanup] running semantic cache cleanup...")

            qdrant_client.delete(
                collection_name=config["semantic_cache_collection_name"],
                points_selector=Filter(
                    must=[
                        FieldCondition(
                            key="expires_at",
                            range=Range(lt=current_time),
                        )
                    ]
                ),
            )

            print("[cleanup] done")
        except Exception as e:
            print(f"[cleanup] error: {e}")

        await asyncio.sleep(interval)