from app.schemas.state import GraphState
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from app.service.LLMProviders import generate_completion
from app.config.models import GENERATION_MODEL, GENERATION_PROVIDER

def _to_openai_message(message) -> dict:
    role_map = {"human": "user", "ai": "assistant", "system": "system"}
    return {
        "role": role_map.get(getattr(message, "type", ""), "user"),
        "content": getattr(message, "content", ""),
    }

def llm_node(state: GraphState):
    print("[flow] entering llm_node")

    SYSTEM_PROMPT = """You are a helpful assistant that answers user queries."""

    messages = list(state.messages or [])

    if not messages:
        messages.append(SystemMessage(content=SYSTEM_PROMPT))

    if not messages or getattr(messages[-1], "type", "") != "human" or getattr(messages[-1], "content", "") != state.query:
        messages.append(HumanMessage(content=state.query))

    openai_messages = [_to_openai_message(message) for message in messages]

    response = generate_completion(
        provider=GENERATION_PROVIDER,
        model=GENERATION_MODEL,
        messages=openai_messages
    )

    assistant_text = response

    return {
        "messages": [AIMessage(content=assistant_text)],
        "response": assistant_text,
    }