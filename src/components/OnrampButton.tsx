"use client";

import { useState } from "react";

interface OnrampButtonProps {
  walletAddress: string;
  cryptoToken: string;
  cryptoChain: string;
  fiatCurrency?: string;
  fiatAmount?: number;
}

export default function OnrampButton({
  walletAddress,
  cryptoToken,
  cryptoChain,
  fiatCurrency = "USD",
  fiatAmount = 100,
}: OnrampButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuyWithCard = async () => {
    if (!walletAddress) {
      setError("Please enter a wallet address first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onramp/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          cryptoToken,
          cryptoChain,
          fiatCurrency,
          fiatAmount,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create checkout session");
      }

      const data = await res.json();

      if (data.redirectUrl) {
        window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleBuyWithCard}
        disabled={loading || !walletAddress}
        className="w-full flex items-center justify-center gap-2 bg-surface-200 border border-border hover:border-accent/50 text-white rounded-xl px-4 py-3 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-300"
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CreditCardIcon />
        )}
        {loading ? "Creating checkout..." : "Buy with Card"}
      </button>
      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}

function CreditCardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="text-gray-400"
    >
      <rect
        x="1"
        y="3"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M1 7H15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
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
  );
}
