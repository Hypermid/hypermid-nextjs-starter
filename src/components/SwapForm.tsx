"use client";

import { useState, useMemo } from "react";
import ChainSelector from "./ChainSelector";
import TokenInput from "./TokenInput";
import QuoteDisplay from "./QuoteDisplay";
import StatusTracker from "./StatusTracker";
import OnrampButton from "./OnrampButton";
import { useQuote } from "@/hooks/useQuote";
import { useSwapStatus } from "@/hooks/useSwapStatus";
import { POPULAR_TOKENS, NATIVE_TOKEN } from "@/lib/constants";
import { getChainById } from "@/lib/chains";

export default function SwapForm() {
  // From side
  const [fromChain, setFromChain] = useState(1);
  const [fromToken, setFromToken] = useState(NATIVE_TOKEN);
  const [fromAmount, setFromAmount] = useState("");

  // To side
  const [toChain, setToChain] = useState(42161);
  const [toToken, setToToken] = useState(NATIVE_TOKEN);

  // Addresses
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");

  // Execution state
  const [executing, setExecuting] = useState(false);
  const [executeError, setExecuteError] = useState<string | null>(null);

  // Quote hook
  const quoteParams = useMemo(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return null;

    // Convert human-readable amount to raw amount based on token decimals
    const tokens = POPULAR_TOKENS[fromChain] ?? [];
    const token = tokens.find((t) => t.address === fromToken);
    const decimals = token?.decimals ?? 18;
    const rawAmount = BigInt(
      Math.floor(parseFloat(fromAmount) * Math.pow(10, decimals)),
    ).toString();

    return {
      fromChain,
      fromToken,
      fromAmount: rawAmount,
      toChain,
      toToken,
    };
  }, [fromChain, fromToken, fromAmount, toChain, toToken]);

  const { quote, loading: quoteLoading, error: quoteError } = useQuote(quoteParams);

  // Status hook
  const { step, error: statusError, startPolling } = useSwapStatus();

  // Reset token when chain changes
  const handleFromChainChange = (chainId: number) => {
    setFromChain(chainId);
    const tokens = POPULAR_TOKENS[chainId];
    setFromToken(tokens?.[0]?.address ?? NATIVE_TOKEN);
  };

  const handleToChainChange = (chainId: number) => {
    setToChain(chainId);
    const tokens = POPULAR_TOKENS[chainId];
    setToToken(tokens?.[0]?.address ?? NATIVE_TOKEN);
  };

  // Swap direction
  const handleFlip = () => {
    setFromChain(toChain);
    setToChain(fromChain);
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
  };

  // Execute swap
  const handleExecute = async () => {
    if (!fromAddress || !toAddress) {
      setExecuteError("Please enter both wallet addresses");
      return;
    }
    if (!quoteParams) return;

    setExecuting(true);
    setExecuteError(null);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quoteParams,
          fromAddress,
          toAddress,
          depositMode: "manual",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Execution failed");
      }

      const result = await res.json();

      // Start polling based on provider
      if (result.provider === "near-intents" && result.correlationId) {
        startPolling({
          provider: "near-intents",
          correlationId: result.correlationId,
        });
      } else if (result.transactionRequest) {
        // LI.FI route -- in a real app you would sign this with the user's wallet
        // For demo purposes we show the transaction data
        startPolling({
          fromChain,
          toChain,
        });
      }
    } catch (err) {
      setExecuteError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setExecuting(false);
    }
  };

  const fromChainMeta = getChainById(fromChain);
  const toChainMeta = getChainById(toChain);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main swap card */}
      <div className="bg-surface-100 border border-border rounded-2xl p-5 space-y-4 shadow-xl shadow-black/20">
        <h2 className="text-lg font-semibold text-white">Swap</h2>

        {/* From section */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ChainSelector
              label="From chain"
              value={fromChain}
              onChange={handleFromChainChange}
            />
            <TokenInput
              chainId={fromChain}
              tokenAddress={fromToken}
              amount={fromAmount}
              onTokenChange={setFromToken}
              onAmountChange={setFromAmount}
              label="You pay"
            />
          </div>
        </div>

        {/* Flip button */}
        <div className="flex justify-center -my-1">
          <button
            onClick={handleFlip}
            className="w-9 h-9 rounded-xl bg-surface-300 border border-border flex items-center justify-center hover:bg-accent/20 hover:border-accent/50 transition-all group"
            aria-label="Swap direction"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-gray-400 group-hover:text-accent transition-colors"
            >
              <path
                d="M4 6L8 2L12 6M12 10L8 14L4 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* To section */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ChainSelector
              label="To chain"
              value={toChain}
              onChange={handleToChainChange}
            />
            <TokenInput
              chainId={toChain}
              tokenAddress={toToken}
              amount=""
              onTokenChange={setToToken}
              onAmountChange={() => {}}
              label="You receive"
              readOnly
            />
          </div>
        </div>

        {/* Wallet addresses */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              From address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="w-full bg-surface-200 border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              To address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="w-full bg-surface-200 border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors font-mono"
            />
          </div>
        </div>

        {/* Loading indicator */}
        {quoteLoading && (
          <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400">
            <svg
              className="animate-spin h-4 w-4 text-accent"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Fetching best quote...
          </div>
        )}

        {/* Quote error */}
        {quoteError && (
          <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center">
            {quoteError}
          </div>
        )}

        {/* Quote display */}
        {quote && !quoteLoading && <QuoteDisplay quote={quote} />}

        {/* Execute button */}
        <button
          onClick={handleExecute}
          disabled={!quote || quoteLoading || executing || !fromAddress || !toAddress}
          className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-4 py-3.5 text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {executing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Executing...
            </span>
          ) : !fromAddress || !toAddress ? (
            "Enter wallet addresses"
          ) : !quote ? (
            "Enter an amount"
          ) : (
            "Swap"
          )}
        </button>

        {/* Execute error */}
        {executeError && (
          <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center">
            {executeError}
          </div>
        )}
      </div>

      {/* Status tracker */}
      <StatusTracker step={step} error={statusError} />

      {/* On-ramp section */}
      <div className="bg-surface-100 border border-border rounded-2xl p-5 space-y-3 shadow-xl shadow-black/20">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Need crypto?</h3>
          <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-medium">
            On-ramp
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Buy {fromChainMeta?.nativeCurrency ?? "crypto"} on{" "}
          {fromChainMeta?.name ?? "your chain"} with a credit card via RampNow.
        </p>
        <OnrampButton
          walletAddress={fromAddress}
          cryptoToken={
            POPULAR_TOKENS[fromChain]?.find((t) => t.address === fromToken)
              ?.symbol ?? "ETH"
          }
          cryptoChain={fromChainMeta?.name?.toLowerCase() ?? "ethereum"}
        />
      </div>
    </div>
  );
}
