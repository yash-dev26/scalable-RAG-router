import { useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { parseSseBlock, upsertTrace, mapSources, randomId } from "../lib/utils.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
const FIRST_REQUEST_BOOT_HINT_DELAY_MS = 8000;
const FIRST_REQUEST_BOOT_HINT = "Backend is booting up (free tier cold start). First response can take around a minute.";

export function useChat() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const isFirstQueryRef = useRef(true);

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamTrace, setStreamTrace] = useState([]);
  const [streamMessage, setStreamMessage] = useState("");
  const [threadId, setThreadId] = useState(() => `t_${randomId()}`);

  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [ingestedFileId, setIngestedFileId] = useState(null);

  async function submitQuery(query) {
    if (!query.trim() || isLoading) return;

    const token = await getToken();
    const shouldShowFirstBootHint = isFirstQueryRef.current;
    let bootHintTimer = null;
    let hasReceivedServerEvent = false;
    let collectedTrace = [];
    setIsLoading(true);
    setStreamTrace([]);
    setStreamMessage("Checking caches…");

    if (shouldShowFirstBootHint) {
      bootHintTimer = window.setTimeout(() => {
        if (!hasReceivedServerEvent) {
          setStreamMessage(FIRST_REQUEST_BOOT_HINT);
        }
      }, FIRST_REQUEST_BOOT_HINT_DELAY_MS);
    }

    function appendTrace(entry) {
      hasReceivedServerEvent = true;
      if (bootHintTimer) {
        window.clearTimeout(bootHintTimer);
        bootHintTimer = null;
      }
      collectedTrace = upsertTrace(collectedTrace, entry);
      setStreamTrace([...collectedTrace]);
      setStreamMessage(`${entry.node}: ${entry.detail}`);
    }

    try {
      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          query,
          file_id: hasUploadedFile ? ingestedFileId : null,
          thread_id: threadId,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. You can make 8 requests per minute. Please wait before trying again.");
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.detail || `Stream failed (${res.status})`);
      }

      if (!res.body) {
        throw new Error("No response body from server");
      }

      const reader = res.body.getReader();
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

          hasReceivedServerEvent = true;
          if (bootHintTimer) {
            window.clearTimeout(bootHintTimer);
            bootHintTimer = null;
          }

          if (payload.type === "status") {
            setStreamMessage(payload.message || "Processing…");
          } else if (payload.type === "cache_hit") {
            appendTrace({ node: payload.cache || "cache", status: "done", detail: payload.message || "Cache hit." });
          } else if (payload.type === "node") {
            appendTrace({ node: payload.node, status: payload.status || "running", detail: payload.detail || "Executing…" });
          } else if (payload.type === "final") {
            finalPayload = payload;
          } else if (payload.type === "error") {
            throw new Error(payload.message || "Stream error");
          }
        }
      }

      if (!finalPayload) throw new Error("No final response from backend.");

      if (finalPayload.thread_id) setThreadId(finalPayload.thread_id);

      setEntries((prev) => [
        ...prev,
        {
          query,
          answer: finalPayload.response,
          sources: mapSources(finalPayload.sources),
          confidence: finalPayload.confidence ?? null,
          pipeline: collectedTrace.length
            ? collectedTrace.map((t) => ({
                name: t.node,
                status: t.status,
                detail: t.detail,
                badge: t.node.includes("rewrite") ? "rewrite" : t.node === "cache" ? "cache" : null,
              }))
            : [{ name: "chat", status: "done", detail: "Response returned.", badge: finalPayload.cached ? "cache" : null }],
          cacheHit: finalPayload.cached === true || finalPayload.cached === "semantic",
        },
      ]);
    } catch (err) {
      const message = err?.response?.data?.detail || err.message || "Request failed";
      const isRateLimit = message.includes("Rate limit");
      setEntries((prev) => [
        ...prev,
        {
          query,
          answer: `Error: ${message}`,
          sources: [],
          confidence: 0,
          pipeline: [{ name: "chat", status: "error", detail: message, badge: isRateLimit ? "rate-limit" : null }],
          cacheHit: false,
        },
      ]);
    } finally {
      if (bootHintTimer) {
        window.clearTimeout(bootHintTimer);
      }
      isFirstQueryRef.current = false;
      setStreamMessage("");
      setStreamTrace([]);
      setIsLoading(false);
    }
  }

  async function uploadFile(file) {
    if (!file) return;
    const token = await getToken();

    setUploadedFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(`${API_BASE}/upload/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHasUploadedFile(true);
      setIngestedFileId(data.file_id);

      setEntries((prev) => [
        ...prev,
        {
          query: `Uploaded: ${file.name}`,
          answer: `File ingested. ID: \`${data.file_id}\``,
          sources: [],
          confidence: null,
          pipeline: [{ name: "ingest", status: "done", detail: `Ingested "${file.name}"`, badge: null }],
          cacheHit: false,
        },
      ]);
    } catch (err) {
      const message = err?.response?.data?.detail || err.message || "Upload failed";
      setHasUploadedFile(false);
      setIngestedFileId(null);
      setEntries((prev) => [
        ...prev,
        {
          query: `Uploaded: ${file.name}`,
          answer: `Upload failed: ${message}`,
          sources: [],
          confidence: 0,
          pipeline: [{ name: "ingest", status: "error", detail: message, badge: null }],
          cacheHit: false,
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  }

  function newThread() {
    setEntries([]);
    setThreadId(`t_${randomId()}`);
    setStreamTrace([]);
    setStreamMessage("");
    setUploadedFileName(null);
    setHasUploadedFile(false);
    setIngestedFileId(null);
  }

  return {
    entries,
    isLoading,
    streamTrace,
    streamMessage,
    threadId,
    uploadedFileName,
    hasUploadedFile,
    isUploading,
    ingestedFileId,
    submitQuery,
    uploadFile,
    newThread,
  };
}