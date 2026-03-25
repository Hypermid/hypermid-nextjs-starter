"use client";

import { POPULAR_TOKENS, type TokenInfo } from "@/lib/constants";

interface TokenInputProps {
  chainId: number;
  tokenAddress: string;
  amount: string;
  onTokenChange: (address: string) => void;
  onAmountChange: (amount: string) => void;
  label: string;
  readOnly?: boolean;
}

export default function TokenInput({
  chainId,
  tokenAddress,
  amount,
  onTokenChange,
  onAmountChange,
  label,
  readOnly = false,
}: TokenInputProps) {
  const tokens = POPULAR_TOKENS[chainId] ?? [];
  const selectedToken = tokens.find((t) => t.address === tokenAddress);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="bg-surface-200 border border-border rounded-xl p-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-colors">
        <select
          value={tokenAddress}
          onChange={(e) => onTokenChange(e.target.value)}
          className="appearance-none bg-surface-300 border border-border rounded-lg px-3 py-2 text-white text-sm font-semibold focus:outline-none cursor-pointer hover:bg-surface-300/80 min-w-[100px]"
        >
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
          {tokens.length === 0 && (
            <option value="">No tokens</option>
          )}
        </select>

        <input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={(e) => {
            const val = e.target.value;
            // Allow only valid decimal numbers
            if (val === "" || /^\d*\.?\d*$/.test(val)) {
              onAmountChange(val);
            }
          }}
          readOnly={readOnly}
          className={`flex-1 bg-transparent text-right text-xl font-medium text-white placeholder-gray-600 focus:outline-none ${
            readOnly ? "cursor-default opacity-70" : ""
          }`}
        />
      </div>
      {selectedToken && (
        <span className="text-[10px] text-gray-500">
          {selectedToken.name} ({selectedToken.decimals} decimals)
        </span>
      )}
    </div>
  );
}
