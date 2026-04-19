from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router
from app.agent.graph.graphBuilder import build_graph
from app.config.checkpointer import connect_to_mongodb
from app.cache.semantic_cleanup import cleanup_semantic_cache
import asyncio

from app.repository.qdrant import ensure_collections



@asynccontextmanager
async def lifespan(app: FastAPI):
    with connect_to_mongodb() as checkpointer:
        print("Successfully connected to MongoDB.")
        app.state.graph = build_graph(checkpointer=checkpointer)
        
        cleanup_task = asyncio.create_task(cleanup_semantic_cache())
        ensure_collections()

        yield

        cleanup_task.cancel()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",   # Vite
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, etc.
    allow_headers=["*"],
)

app.include_router(prefix="/api/v1", router=router)