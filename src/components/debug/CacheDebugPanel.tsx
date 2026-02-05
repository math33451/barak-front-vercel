"use client";

import { useState } from "react";
import { useCacheStatus, useClearCache } from "@/hooks/usePrefetch";
import { httpClient } from "@/infra/httpClient";

/**
 * CacheDebugPanel - Painel de debug para monitorar cache
 * Apenas para desenvolvimento - remover em produção
 */
export function CacheDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { getCacheStatus } = useCacheStatus();
  const { clearAll, clearStale, clearInactive } = useClearCache();

  const [status, setStatus] = useState(getCacheStatus());
  const [httpStats, setHttpStats] = useState(httpClient.getCacheStats());

  const refresh = () => {
    setStatus(getCacheStatus());
    setHttpStats(httpClient.getCacheStats());
  };

  // Auto refresh a cada 2 segundos se habilitado
  if (autoRefresh && typeof window !== "undefined") {
    setTimeout(refresh, 2000);
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        right: 20,
        zIndex: 9999,
        background: "white",
        border: "2px solid #3b82f6",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: "12px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📊 Cache Debug
        </button>
      ) : (
        <div style={{ padding: "16px", minWidth: "300px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px" }}>🔍 Cache Status</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              marginBottom: "12px",
            }}
          >
            <div>
              Total Queries: <strong>{status.total}</strong>
            </div>
            <div>
              Active:{" "}
              <strong style={{ color: "#10b981" }}>{status.active}</strong>
            </div>
            <div>
              Fresh:{" "}
              <strong style={{ color: "#3b82f6" }}>{status.fresh}</strong>
            </div>
            <div>
              Stale:{" "}
              <strong style={{ color: "#f59e0b" }}>{status.stale}</strong>
            </div>
            <div>
              Fetching:{" "}
              <strong style={{ color: "#8b5cf6" }}>{status.fetching}</strong>
            </div>
            <div>
              Errors:{" "}
              <strong style={{ color: "#ef4444" }}>{status.error}</strong>
            </div>
            <hr style={{ margin: "8px 0" }} />
            <div>
              HTTP Pending: <strong>{httpStats.pendingRequests}</strong>
            </div>
            <div>
              Stored ETags: <strong>{httpStats.storedETags}</strong>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexDirection: "column",
            }}
          >
            <button
              onClick={refresh}
              style={{
                padding: "8px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🔄 Refresh
            </button>

            <button
              onClick={() => {
                clearStale();
                setTimeout(refresh, 100);
              }}
              style={{
                padding: "8px",
                background: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🧹 Clear Stale
            </button>

            <button
              onClick={() => {
                clearInactive();
                setTimeout(refresh, 100);
              }}
              style={{
                padding: "8px",
                background: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🗑️ Clear Inactive
            </button>

            <button
              onClick={() => {
                clearAll();
                setTimeout(refresh, 100);
              }}
              style={{
                padding: "8px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              ⚠️ Clear All
            </button>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                marginTop: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto Refresh (2s)
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
