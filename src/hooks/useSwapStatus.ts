"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type SwapStep = "idle" | "initiated" | "processing" | "complete" | "failed";

export interface SwapStatusResult {
  provider: "lifi" | "near-intents";
  status?: string;
  [key: string]: unknown;
}

export interface UseSwapStatusReturn {
  status: SwapStatusResult | null;
  step: SwapStep;
  loading: boolean;
  error: string | null;
  startPolling: (params: StatusPollParams) => void;
  stopPolling: () => void;
}

export interface StatusPollParams {
  /** For LI.FI routes */
  txHash?: string;
  fromChain?: number;
  toChain?: number;
  /** For Near Intents routes */
  provider?: "near-intents";
  correlationId?: string;
}

const TERMINAL_STATUSES = new Set(["DONE", "FAILED", "SUCCESS", "REFUNDED"]);

/**
 * React hook for polling swap status with configurable interval.
 * Calls the /api/status server route.
 */
export function useSwapStatus(intervalMs = 5000): UseSwapStatusReturn {
  const [status, setStatus] = useState<SwapStatusResult | null>(null);
  const [step, setStep] = useState<SwapStep>("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const paramsRef = useRef<StatusPollParams | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    const params = paramsRef.current;
    if (!params) return;

    try {
      const qs = new URLSearchParams();
      if (params.provider === "near-intents") {
        qs.set("provider", "near-intents");
        if (params.correlationId) qs.set("correlationId", params.correlationId);
      } else {
        if (params.txHash) qs.set("txHash", params.txHash);
        if (params.fromChain) qs.set("fromChain", String(params.fromChain));
        if (params.toChain) qs.set("toChain", String(params.toChain));
      }

      const res = await fetch(`/api/status?${qs.toString()}`);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Status request failed (${res.status})`);
      }

      const data: SwapStatusResult = await res.json();
      setStatus(data);

      // Derive step from status
      const s = data.status?.toUpperCase() ?? "";
      if (s === "DONE" || s === "SUCCESS") {
        setStep("complete");
        stopPolling();
      } else if (s === "FAILED" || s === "REFUNDED") {
        setStep("failed");
        stopPolling();
      } else if (TERMINAL_STATUSES.has(s)) {
        stopPolling();
      } else {
        setStep("processing");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    }
  }, [stopPolling]);

  const startPolling = useCallback(
    (params: StatusPollParams) => {
      stopPolling();
      paramsRef.current = params;
      setStep("initiated");
      setLoading(true);
      setError(null);
      setStatus(null);

      // Initial fetch
      poll().then(() => setLoading(false));

      // Start interval
      intervalRef.current = setInterval(poll, intervalMs);
    },
    [intervalMs, poll, stopPolling],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return { status, step, loading, error, startPolling, stopPolling };
}
