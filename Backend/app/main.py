from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.router import router
from app.agent.graph.graphBuilder import build_graph
from app.config.checkpointer import connect_to_mongodb
from app.cache.semantic_cleanup import cleanup_semantic_cache
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    with connect_to_mongodb() as checkpointer:
        print("Successfully connected to MongoDB.")
        app.state.graph = build_graph(checkpointer=checkpointer)
        
        cleanup_task = asyncio.create_task(cleanup_semantic_cache())

        yield

        cleanup_task.cancel()

app = FastAPI(lifespan=lifespan)

app.include_router(prefix="/api/v1", router=router)