"use client";

import { CHAINS, type ChainMeta } from "@/lib/chains";

interface ChainSelectorProps {
  label: string;
  value: number;
  onChange: (chainId: number) => void;
}

export default function ChainSelector({ label, value, onChange }: ChainSelectorProps) {
  const selected = CHAINS.find((c) => c.id === value);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none bg-surface-200 border border-border rounded-xl px-4 py-3 pr-10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors cursor-pointer hover:bg-surface-300"
        >
          {CHAINS.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.icon} {chain.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <ChevronIcon />
        </div>
      </div>
      {selected && (
        <span className="text-[10px] text-gray-500">
          Native: {selected.nativeCurrency}
        </span>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="text-gray-400"
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
