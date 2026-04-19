const NAIVE_NODES = ["Input", "Retrieve", "Output"];
const ADAPTIVE_NODES = ["Input", "Plan", "Rewrite", "Retrieve", "Evaluate", "Rerank", "Output"];
const ADAPTIVE_HIGHLIGHTED = new Set(["Plan", "Rewrite", "Evaluate", "Rerank"]);

const DIFFERENTIATORS = [
  { icon: "⟳", title: "Adaptive Query Rewriting", desc: "Dynamically rewrites queries using single or multi-query strategies based on the planner's assessment of intent." },
  { icon: "⚡", title: "Semantic + Response Caching", desc: "Redis-backed caching at both the semantic and full-response levels to eliminate redundant LLM calls." },
  { icon: "◈", title: "Vector Retrieval with Scores", desc: "Qdrant-powered similarity search returns top-k documents with cosine similarity scores exposed in the UI." },
  { icon: "↑", title: "Cross-Encoder Reranking", desc: "A dedicated reranker model re-scores retrieved documents to surface the most relevant context." },
  { icon: "◎", title: "Confidence-Based Routing", desc: "LangGraph evaluator node scores retrieval quality and routes to fallback LLM generation when confidence is low." },
  { icon: "⬡", title: "LangGraph Execution Graph", desc: "Explicit node graph: pre_planner → rewrite → retrieve → evaluator → rerank → generate. Fully inspectable." },
];

const TECH_STACK = [
  { name: "FastAPI", color: "bg-teal-500", desc: "Async REST backend" },
  { name: "LangGraph", color: "bg-violet-500", desc: "Execution graph" },
  { name: "Qdrant", color: "bg-red-500", desc: "Vector database" },
  { name: "Redis", color: "bg-rose-500", desc: "Semantic cache" },
  { name: "MongoDB", color: "bg-green-500", desc: "Document store" },
];

const PIPELINE_NODES_LIST = ["pre_planner", "query_rewrite", "retrieve", "evaluator", "rerank", "generate"];

const LOADING_STEPS = [
  "Analyzing query intent...",
  "Rewriting query for retrieval...",
  "Retrieving from vector DB...",
  "Evaluating context quality...",
  "Reranking documents...",
  "Generating response...",
];

const MOCK_RESPONSES = [
  {
    answer:
      "**Adaptive RAG** is an evolved retrieval-augmented generation architecture that introduces a *planning layer* before retrieval. Unlike **naive RAG** which blindly retrieves and passes documents to the LLM, adaptive RAG first evaluates whether retrieval is necessary at all.\n\nThe key differences are:\n- A `pre_planner` node decides the retrieval strategy\n- Queries are rewritten for improved vector similarity\n- Retrieved documents are evaluated and reranked\n- Confidence scoring determines whether to use retrieval or fallback to parametric memory",
    sources: [
      { id: "doc_a3f2", text: "Adaptive RAG extends standard RAG by incorporating a planning phase that dynamically routes queries through different retrieval strategies...", score: 0.91, rank: 1 },
      { id: "doc_b1c8", text: "Unlike naive retrieval pipelines, adaptive systems maintain a confidence evaluator that can bypass retrieval entirely for factual queries...", score: 0.84, rank: 2 },
      { id: "doc_e9d1", text: "Query rewriting in multi-step RAG has been shown to improve retrieval precision by up to 34% on domain-specific corpora...", score: 0.76, rank: 3 },
    ],
    confidence: 0.89,
    pipeline: [
      { name: "pre_planner", status: "done", detail: "Classified as retrieval-required query. Strategy: multi_rewrite", badge: null },
      { name: "multi_rewrite", status: "done", detail: "Generated 3 query variants: semantic expansion + entity decomposition", badge: "rewrite" },
      { name: "retrieve", status: "done", detail: "Qdrant top-k=5 retrieved. Reciprocal rank fusion applied.", badge: null },
      { name: "evaluator", status: "done", detail: "Context relevance: 0.89. Passed threshold (>0.75). Proceeding to rerank.", badge: null },
      { name: "rerank", status: "done", detail: "Cross-encoder reranked 5 → 3 documents. Dropped 2 low-signal chunks.", badge: null },
      { name: "generate", status: "done", detail: "Final answer generated with 3-document context window.", badge: null },
    ],
    cacheHit: false,
    processingMs: 1240,
  },
  {
    answer:
      "The `evaluator` node computes a **context relevance score** by comparing the semantic similarity between the rewritten query and each retrieved document chunk. This is done in a two-pass approach:\n\n1. **Pass 1**: Compute cosine similarity between query embedding and document embeddings\n2. **Pass 2**: Cross-encoder scores the top-k pairs for fine-grained relevance\n\nIf the aggregate score falls below `CONFIDENCE_THRESHOLD = 0.75`, the graph routes to `fallback_generate` using only the LLM's parametric knowledge.",
    sources: [
      { id: "doc_f4a9", text: "The evaluator node implements a dual-pass scoring mechanism combining dense retrieval scores with cross-encoder reranking...", score: 0.93, rank: 1 },
      { id: "doc_c2b7", text: "Confidence thresholds in RAG systems prevent hallucination by detecting low-quality retrieval before LLM generation...", score: 0.87, rank: 2 },
    ],
    confidence: 0.93,
    pipeline: [
      { name: "pre_planner", status: "done", detail: "Classified as retrieval-required. Strategy: single_rewrite", badge: null },
      { name: "single_rewrite", status: "done", detail: "Query rewritten with entity expansion.", badge: "rewrite" },
      { name: "retrieve", status: "done", detail: "Qdrant top-k=4 retrieved.", badge: null },
      { name: "evaluator", status: "done", detail: "Context relevance: 0.93. Passed threshold.", badge: null },
      { name: "rerank", status: "done", detail: "Reranked 4 → 2 documents.", badge: null },
      { name: "generate", status: "done", detail: "Answer generated from 2 high-confidence chunks.", badge: null },
    ],
    cacheHit: true,
    processingMs: 48,
  },
];

const STATIC_DATA = {
  NAIVE_NODES,
  ADAPTIVE_NODES,
    ADAPTIVE_HIGHLIGHTED,
    DIFFERENTIATORS,
    TECH_STACK,
    PIPELINE_NODES_LIST,
    LOADING_STEPS,
    MOCK_RESPONSES,
};

export default STATIC_DATA;