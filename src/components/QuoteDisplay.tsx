"use client";

import type { QuoteResult } from "@/hooks/useQuote";

interface QuoteDisplayProps {
  quote: QuoteResult;
}

export default function QuoteDisplay({ quote }: QuoteDisplayProps) {
  const q = quote.quote as Record<string, unknown>;

  // Extract estimated output from the nested quote structure
  const estimate = (q?.estimate ?? q) as Record<string, unknown>;
  const toAmount = estimate?.toAmount as string | undefined;
  const toAmountMin = estimate?.toAmountMin as string | undefined;
  const toToken = estimate?.toToken as Record<string, unknown> | undefined;
  const fromToken = estimate?.fromToken as Record<string, unknown> | undefined;

  // Time estimate
  const executionDuration = (estimate?.executionDuration as number) ?? 0;
  const tool = (q?.tool as string) ?? (q?.toolDetails as Record<string, unknown>)?.name ?? "Bridge";

  // Format amounts for display
  const formatAmount = (raw: string | undefined, decimals: number) => {
    if (!raw) return "...";
    const num = Number(raw) / Math.pow(10, decimals);
    if (num < 0.001) return "<0.001";
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const toDecimals = (toToken?.decimals as number) ?? 18;
  const toSymbol = (toToken?.symbol as string) ?? "";

  const feeBps = quote.feeBps;
  const feePercent = feeBps / 100;

  return (
    <div className="bg-surface-200 border border-border rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Quote Details
        </span>
        <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-medium">
          {quote.provider === "near-intents" ? "Near Intents" : "LI.FI"}
        </span>
      </div>

      {/* Estimated output */}
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-gray-400">You receive</span>
        <span className="text-lg font-semibold text-white">
          {formatAmount(toAmount, toDecimals)} {toSymbol}
        </span>
      </div>

      {/* Min output */}
      {toAmountMin && (
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-400">Minimum received</span>
          <span className="text-sm text-gray-300">
            {formatAmount(toAmountMin, toDecimals)} {toSymbol}
          </span>
        </div>
      )}

      {/* Fee */}
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-gray-400">Platform fee</span>
        <span className="text-sm text-gray-300">{feePercent}%</span>
      </div>

      {/* Time estimate */}
      {executionDuration > 0 && (
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-400">Estimated time</span>
          <span className="text-sm text-gray-300">
            ~{Math.ceil(executionDuration / 60)} min
          </span>
        </div>
      )}

      {/* Route / Tool */}
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-gray-400">Route</span>
        <span className="text-sm text-gray-300">{String(tool)}</span>
      </div>

      {quote.isDryQuote && (
        <div className="text-[10px] text-yellow-500/80 text-center pt-1 border-t border-border">
          Dry quote (no wallet connected) -- actual amounts may vary
        </div>
      )}
    </div>
  );
}
