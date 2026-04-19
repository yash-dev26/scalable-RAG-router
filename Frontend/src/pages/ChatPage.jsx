import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ResponseEntry from "../components/chat/ResponseEntry";
import DocPanel from "../components/chat/DocPanel";
import LoadingEntry from "../components/chat/LoadingEntry";
import STATIC_DATA from "../static/staticData";

const { PIPELINE_NODES_LIST, LOADING_STEPS } = STATIC_DATA;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

function parseSseBlock(block) {
  const lines = block.split("\n").map((line) => line.trimEnd());
  const dataLines = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());

  if (dataLines.length === 0) return null;

  try {
    return JSON.parse(dataLines.join("\n"));
  } catch {
    return null;
  }
}

function upsertTrace(trace, entry) {
  const filtered = trace.filter((item) => item.node !== entry.node);
  return [...filtered, entry].slice(-6);
}

function ChatPage() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [streamTrace, setStreamTrace] = useState([]);
  const [streamMessage, setStreamMessage] = useState("Ready");
  const [threadId, setThreadId] = useState(() => `t_${Math.random().toString(36).slice(2, 8)}`);
  const [uploadedFileName, setUploadedFileName] = useState("adaptive_rag_docs_v2.pdf");
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [ingestedFileId, setIngestedFileId] = useState(null);
  const feedRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [entries, isLoading]);

  async function handleSubmit() {
    if (!query.trim() || isLoading) return;
    const nextQuery = query.trim();
    const startedAt = performance.now();
    let collectedTrace = [];

    setQuery("");
    setIsLoading(true);
    setLoadingStep(0);
    setStreamTrace([]);
    setStreamMessage("Checking caches...");

    function appendTrace(entry) {
      collectedTrace = upsertTrace(collectedTrace, entry);
      setStreamTrace(collectedTrace);
      setStreamMessage(`${entry.node}: ${entry.detail}`);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "demo-user",
          query: nextQuery,
          file_id: hasUploadedFile ? ingestedFileId : null,
          thread_id: threadId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalPayload = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          const payload = parseSseBlock(block);
          if (!payload) continue;

          if (payload.type === "status") {
            setStreamMessage(payload.message || payload.step || "Processing...");
            continue;
          }

          if (payload.type === "cache_hit") {
            appendTrace({
              node: payload.cache || "cache",
              status: "done",
              detail: payload.message || "Cache hit.",
            });
            continue;
          }

          if (payload.type === "node") {
            appendTrace({
              node: payload.node,
              status: payload.status || "running",
              detail: payload.detail || "Executing node...",
            });
            continue;
          }

          if (payload.type === "final") {
            finalPayload = payload;
            continue;
          }

          if (payload.type === "error") {
            throw new Error(payload.message || "Stream error");
          }
        }
      }

      if (!finalPayload) {
        throw new Error("No final response received from the backend stream.");
      }

      setThreadId(finalPayload.thread_id || threadId);

      setEntries((prev) => [
        ...prev,
        {
          query: nextQuery,
          answer: finalPayload.response,
          sources: [],
          confidence: finalPayload.cached ? 1 : 0.75,
          pipeline: collectedTrace.length > 0
            ? collectedTrace.map((item) => ({
                name: item.node,
                status: item.status,
                detail: item.detail,
                badge: item.node.includes("rewrite") ? "rewrite" : item.node === "cache" ? "cache" : null,
              }))
            : [
                {
                  name: "chat",
                  status: "done",
                  detail: "Response returned from backend.",
                  badge: finalPayload.cached ? "cache" : null,
                },
              ],
          cacheHit: finalPayload.cached === true || finalPayload.cached === "semantic",
          processingMs: Math.max(1, Math.round(performance.now() - startedAt)),
        },
      ]);
    } catch (error) {
      const errorMessage = error?.response?.data?.detail || error?.response?.data?.message || error.message || "Request failed";

      setEntries((prev) => [
        ...prev,
        {
          query: nextQuery,
          answer: `Request failed: ${errorMessage}`,
          sources: [],
          confidence: 0,
          pipeline: [
            {
              name: "chat",
              status: "skipped",
              detail: "Backend chat request failed.",
              badge: null,
            },
          ],
          cacheHit: false,
          processingMs: Math.max(1, Math.round(performance.now() - startedAt)),
        },
      ]);
    } finally {
      setLoadingStep(LOADING_STEPS.length - 1);
      setStreamMessage("Ready");
      setStreamTrace([]);
      setIsLoading(false);
    }
  }

  function handleNewThread() {
    setEntries([]);
    setThreadId(`t_${Math.random().toString(36).slice(2, 8)}`);
    setStreamTrace([]);
    setStreamMessage("Ready");
  }

  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", "demo-user");
      formData.append("file", file);

      const { data } = await axios.post(`${API_BASE_URL}/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setHasUploadedFile(true);
      setIngestedFileId(data.file_id);

      setEntries((prev) => [
        ...prev,
        {
          query: `Uploaded file: ${file.name}`,
          answer: `File Ingestion completed successfully. File ID: ${data.file_id}`,
          sources: [{ id: data.file_id, text: file.name, score: 1, rank: 1 }],
          confidence: 1,
          pipeline: [
            {
              name: "ingest",
              status: "done",
              detail: `Uploaded and ingested "${file.name}" on backend.`,
              badge: null,
            },
          ],
          cacheHit: false,
          processingMs: 0,
        },
      ]);
    } catch (error) {
      const errorMessage = error?.response?.data?.detail || error.message || "Upload failed";

      setHasUploadedFile(false);
      setIngestedFileId(null);

      setEntries((prev) => [
        ...prev,
        {
          query: `Uploaded file: ${file.name}`,
          answer: `Upload failed: ${errorMessage}`,
          sources: [{ id: "upload_error", text: file.name, score: 0, rank: 1 }],
          confidence: 0,
          pipeline: [
            {
              name: "ingest",
              status: "skipped",
              detail: `Backend rejected or failed to ingest "${file.name}".`,
              badge: null,
            },
          ],
          cacheHit: false,
          processingMs: 0,
        },
      ]);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  const latestSources = entries.length > 0 ? entries[entries.length - 1].sources : [];

  return (
    <div className="flex flex-col bg-slate-900" style={{ height: "100vh", paddingTop: 60, fontFamily: "'Sora', sans-serif" }}>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 min-w-64 bg-slate-800 border-r border-slate-700 flex flex-col p-4 overflow-y-auto">
          <p className="font-mono text-xs text-slate-600 tracking-widest mb-3">SESSION</p>

          <button
            onClick={handleNewThread}
            className="w-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-500/18 transition-colors mb-5"
          >
            + New Thread
          </button>

          <div className="bg-slate-700 rounded-lg p-3 mb-4">
            <p className="font-mono text-xs text-slate-200 mb-1 truncate">{uploadedFileName}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs text-emerald-400">
                {isUploading
                  ? "Uploading..."
                  : hasUploadedFile
                    ? `Ingested · ${ingestedFileId}`
                    : "Indexed · Ready"}
              </span>
            </div>
          </div>

          <p className="font-mono text-xs text-slate-600 tracking-widest mb-2">THREAD INFO</p>
          {[
            ["Thread ID", threadId],
            ["Queries", entries.length],
            ["Model", "gpt-4o"],
            ["Strategy", "adaptive"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-600">{label}</span>
              <span className="font-mono text-xs text-slate-400">{value}</span>
            </div>
          ))}

          <p className="font-mono text-xs text-slate-600 tracking-widest mt-5 mb-2">PIPELINE NODES</p>
          {PIPELINE_NODES_LIST.map((node) => (
            <div key={node} className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-50" />
              <span className="font-mono text-xs text-slate-500">{node}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          <div className="flex-1 overflow-y-auto px-10 py-8 flex flex-col gap-8" ref={feedRef}>
            {entries.length === 0 && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl mb-5">
                  ⬡
                </div>
                <h3 className="text-lg font-semibold mb-2">Adaptive RAG Agent</h3>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-8">
                  Ask a question about your document. Every retrieval step will be shown transparently.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  {["What is adaptive RAG?", "How does the evaluator node work?", "Explain query rewriting strategies"].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono px-4 py-2.5 rounded-lg cursor-pointer text-left hover:border-emerald-500/40 hover:text-slate-300 transition-all"
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {entries.map((entry, index) => (
              <ResponseEntry key={index} entry={entry} />
            ))}

            {isLoading && <LoadingEntry step={loadingStep} loadingSteps={LOADING_STEPS} trace={streamTrace} message={streamMessage} />}
          </div>

          <div className="px-10 py-4 border-t border-slate-700 bg-slate-950/60">
            <div className="flex items-center gap-3 max-w-3xl">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-11 h-11 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg flex items-center justify-center hover:border-emerald-500/40 hover:text-emerald-400 transition-colors shrink-0"
                title="Upload document"
                aria-label="Upload document"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l8.49-8.49a3.5 3.5 0 114.95 4.95l-8.5 8.49a2 2 0 01-2.83-2.83l7.78-7.78" />
                </svg>
              </button>
              <span className="w-px h-6 bg-slate-700/90 shrink-0" aria-hidden="true" />
              <input
                className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-sm px-4 py-3 rounded-lg outline-none placeholder-slate-600 focus:border-emerald-500/40 transition-colors"
                style={{ fontFamily: "'Sora', sans-serif" }}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
                placeholder="Ask a question about your documents..."
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || isUploading || !query.trim()}
                className="bg-emerald-500 text-black font-mono font-semibold text-xs px-5 py-3 rounded-lg hover:opacity-85 disabled:opacity-50 disabled:cursor-default transition-opacity shrink-0"
              >
                {isLoading ? "···" : "Run →"}
              </button>
            </div>
          </div>
        </div>

        <DocPanel sources={latestSources} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

export default ChatPage;