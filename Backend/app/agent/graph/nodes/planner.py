from app.config.openaiConfig import openai_client
from app.schemas.state import GraphState
import json


def planner_node(state: GraphState):
    query = state.query

    PLANNER_PROMPT = """
You are a query planner for an AI system.

Decide how to handle the query.

Return ONLY valid JSON with this schema:
{
  "intent": "rag" or "llm",
  "rewrite_type": "none" or "single" or "multi",
  "confidence": 0.0 - 1.0
}

Rules:
- Use "rag" if the query refers to user-specific documents or uploaded files, if query requires document-specific information
- Use "llm" for general knowledge questions
- Use rewrite_type "single" if the query is ambiguous and could be interpreted in multiple ways
- Use rewrite_type "multi" if the query is short, vague, or could be broken down into multiple simpler queries for better retrieval
- Return confidence between 0 and 1.
    -High confidence (0.85+):
        - general knowledge
        - no external data needed

    -Low confidence:
        - document-specific queries
        - factual lookups
        - ambiguous queries
"""

    response = openai_client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": PLANNER_PROMPT},
            {"role": "user", "content": query}
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )

    content = response.choices[0].message.content

    try:
        plan = json.loads(content)
    except Exception:
        plan = {
            "intent": "llm",
            "rewrite_type": "none",
            "confidence": 0.0
        }

    print(f"Planner output: {plan}")
    return plan