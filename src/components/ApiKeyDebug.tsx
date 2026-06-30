"use client";

import { hasAiConfigured } from "@/lib/ai-client";

export default function ApiKeyDebug() {
  return (
    <div className="fixed bottom-5 right-5 z-[100] text-[10px] font-mono"
      style={{ background: hasAiConfigured() ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", color: hasAiConfigured() ? "#22c55e" : "#ef4444", padding: "4px 8px", borderRadius: "6px", border: "1px solid", borderColor: hasAiConfigured() ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)" }}>
      AI: {hasAiConfigured() ? "ON ✅" : "OFF ❌"}
    </div>
  );
}
