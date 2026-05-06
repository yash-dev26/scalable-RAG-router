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


const STATIC_DATA = {
  NAIVE_NODES,
  ADAPTIVE_NODES,
    ADAPTIVE_HIGHLIGHTED,
    DIFFERENTIATORS,
    TECH_STACK,
    PIPELINE_NODES_LIST,
    LOADING_STEPS,
};

export default STATIC_DATA;