"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface QuoteRequest {
  fromChain: number;
  fromToken: string;
  fromAmount: string;
  toChain: number;
  toToken: string;
}

export interface QuoteResult {
  quote: Record<string, unknown>;
  provider: "lifi" | "near-intents";
  feeBps: number;
  isDryQuote: boolean;
}

export interface UseQuoteReturn {
  quote: QuoteResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * React hook for fetching swap quotes with debouncing.
 * Calls the /api/quote server route to keep the API key hidden.
 */
export function useQuote(params: QuoteRequest | null, debounceMs = 500): UseQuoteReturn {
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchQuote = useCallback(async (request: QuoteRequest) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams({
        fromChain: String(request.fromChain),
        fromToken: request.fromToken,
        fromAmount: request.fromAmount,
        toChain: String(request.toChain),
        toToken: request.toToken,
      });

      const res = await fetch(`/api/quote?${qs.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Quote request failed (${res.status})`);
      }

      const data: QuoteResult = await res.json();
      setQuote(data);
      setError(null);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to fetch quote");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (params && params.fromAmount && parseFloat(params.fromAmount) > 0) {
      fetchQuote(params);
    }
  }, [params, fetchQuote]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!params || !params.fromAmount || parseFloat(params.fromAmount) <= 0) {
      setQuote(null);
      setLoading(false);
      setError(null);
      return;
    }

    timerRef.current = setTimeout(() => {
      fetchQuote(params);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [params, debounceMs, fetchQuote]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { quote, loading, error, refetch };
}
