from app.schemas.state import GraphState
from app.config.openaiConfig import openai_client
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage


def _to_openai_message(message) -> dict:
    role_map = {"human": "user", "ai": "assistant", "system": "system"}
    return {
        "role": role_map.get(getattr(message, "type", ""), "user"),
        "content": getattr(message, "content", ""),
    }

def generate_node(state: GraphState):
    print("[flow] entering generate_node")
    query = state.query
    context = state.context
    
    base_messages = list(state.messages or [])
    messages_to_add = []

    if context:
        context_text = "\n\n".join(context)

        messages = [
            SystemMessage(
                content="You are an AI assistant that generates responses based on user queries and retrieved context. Use the provided context to answer the user's query as accurately and helpfully as possible. If the context does not contain relevant information, tell the user that you do not have enough information to answer that question."
            ),
            HumanMessage(content=f"Context:\n{context_text}\n\nQuery:\n{query}"),
        ]

        if not base_messages or getattr(base_messages[-1], "type", "") != "human" or getattr(base_messages[-1], "content", "") != query:
            messages_to_add.append(HumanMessage(content=query))
    else:
        messages = base_messages or [HumanMessage(content=query)]

        if not base_messages or getattr(base_messages[-1], "type", "") != "human" or getattr(base_messages[-1], "content", "") != query:
            messages_to_add.append(HumanMessage(content=query))

    openai_messages = [_to_openai_message(message) for message in messages]

    response = openai_client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=openai_messages
    )

    assistant_text = response.choices[0].message.content
    messages_to_add.append(AIMessage(content=assistant_text))

    return {
        "messages": messages_to_add,
        "response": assistant_text
    }