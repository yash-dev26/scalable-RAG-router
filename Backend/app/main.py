from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.router import router
from app.agent.graph.graphBuilder import build_graph
from app.config.checkpointer import connect_to_mongodb


@asynccontextmanager
async def lifespan(app: FastAPI):
	with connect_to_mongodb() as checkpointer:
		print("Successfully connected to MongoDB.")
		app.state.graph = build_graph(checkpointer=checkpointer)
		yield


app = FastAPI(lifespan=lifespan)

app.include_router(prefix="/api/v1", router=router)