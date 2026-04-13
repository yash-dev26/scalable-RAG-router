from langgraph.graph import StateGraph, END
from app.schemas.state import GraphState

from app.agent.graph.nodes.planner import planner_node
from app.agent.graph.nodes.retriever import retrieve_node
from app.agent.graph.nodes.rag_llm import generate_node
from app.agent.graph.nodes.multiRewrite import multi_query_rewrite_node
from app.agent.graph.nodes.singleRewrite import single_query_rewrite_node
from app.agent.graph.nodes.trim_docs import trim_docs_node
from app.agent.graph.nodes.reranking import reranking_node
from app.agent.graph.nodes.llm import llm_node

from app.agent.graph.routing.planner_router import route_after_planner
from app.agent.graph.routing.ranking_router import ranking_decision_node
from app.agent.graph.routing.postRewrite_router import route_after_single_rewrite


def build_graph():
    graph = StateGraph(GraphState)

    # Nodes
    graph.add_node("planner", planner_node)
    graph.add_node("multi-rewrite", multi_query_rewrite_node)
    graph.add_node("single-rewrite", single_query_rewrite_node)
    graph.add_node("retrieve", retrieve_node)
    graph.add_node("trim_docs", trim_docs_node)
    graph.add_node("rerank", reranking_node)
    graph.add_node("generate", generate_node)
    graph.add_node("llm", llm_node)

    # Edges
    graph.add_conditional_edges(
        "planner",
        route_after_planner,
        {
            "multi-rewrite": "multi-rewrite",
            "single-rewrite": "single-rewrite",
            "retrieve": "retrieve",
            "llm": "llm"
        }
    )

    graph.add_edge("multi-rewrite", "retrieve")

    graph.add_conditional_edges(
        "single-rewrite",
        route_after_single_rewrite,
        {
            "retrieve": "retrieve",
            "llm": "llm"
        }
    )

    graph.add_conditional_edges(
        "retrieve",
        ranking_decision_node,
        {
            "do_rerank": "rerank",
            "skip_rerank": "trim_docs"
        }
    )

    graph.add_edge("trim_docs", "generate")
    graph.add_edge("rerank", "generate")

    
    graph.add_edge("generate", END)
    graph.add_edge("llm", END)

    # Entry point
    graph.set_entry_point("planner")

    return graph.compile()