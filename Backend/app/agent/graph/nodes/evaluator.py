import json
from app.schemas.state import GraphState
from app.service.LLMProviders import generate_completion

def post_retrieval_evaluator_node(state: GraphState) -> dict:
    print("[flow] entering post_retrieval_evaluator_node")
    query = state.query
    docs = state.context or []
    scores = state.scores or []

    if not docs:
        print("[evaluator] No docs retrieved → llm_fallback")
        return {"eval_action": "llm_fallback", "confidence": 0.0}

    if scores and scores[0] > 0.82:
        print(f"[evaluator] Strong top score {scores[0]:.3f} → generate")
        return {"eval_action": "generate", "confidence": scores[0]}

    # Pass the query + top-3 doc snippets (first 300 chars each)
    snippets = "\n\n".join(
        f"[Doc {i+1}] {doc['text'][:300]}" for i, doc in enumerate(docs[:3])
    )
    avg_score = sum(scores[:3]) / len(scores[:3]) if scores else 0.0

    EVAL_PROMPT = f"""
You are evaluating whether retrieved documents are relevant enough to answer a user query.

User query: {query}

Retrieved document snippets:
{snippets}

Average retrieval score: {avg_score:.3f}  (range 0-1, higher = more similar)

Decide the best action. Return ONLY valid JSON:
{{
  "eval_action": "generate" | "rewrite_single" | "rewrite_multi" | "llm_fallback",
  "confidence": 0.0 - 1.0,
  "reason": "one-line explanation"
}}

Guidelines:
- "generate"       → docs clearly address the query
- "rewrite_single" → docs exist but query may have been misunderstood; one rewrite likely helps
- "rewrite_multi"  → docs are marginally relevant; diverse sub-queries would improve coverage
- "llm_fallback"   → docs are completely off-topic; general knowledge is better; they must be completely off topic
"""

    response_text = generate_completion(
        provider="groq",
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": EVAL_PROMPT}],
        temperature=0,
        response_format={"type": "json_object"},
    )

    try:
        result = json.loads(response_text)
        eval_action = result.get("eval_action", "generate")
        confidence = float(result.get("confidence", 0.5))
        reason = result.get("reason", "")
    except Exception:
        eval_action, confidence, reason = "generate", 0.5, "parse error"

    print(f"[evaluator] action={eval_action}  confidence={confidence:.2f}  reason={reason}")
    return {"eval_action": eval_action, "confidence": confidence}