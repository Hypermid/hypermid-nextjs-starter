export interface ChainMeta {
  id: number;
  name: string;
  icon: string;
  color: string;
  nativeCurrency: string;
}

export const CHAINS: ChainMeta[] = [
  { id: 1, name: "Ethereum", icon: "\uD83D\uDD37", color: "#627EEA", nativeCurrency: "ETH" },
  { id: 42161, name: "Arbitrum", icon: "\uD83D\uDD35", color: "#28A0F0", nativeCurrency: "ETH" },
  { id: 8453, name: "Base", icon: "\uD83D\uDFE6", color: "#0052FF", nativeCurrency: "ETH" },
  { id: 137, name: "Polygon", icon: "\uD83D\uDFE3", color: "#8247E5", nativeCurrency: "MATIC" },
  { id: 10, name: "Optimism", icon: "\uD83D\uDD34", color: "#FF0420", nativeCurrency: "ETH" },
  { id: 56, name: "BSC", icon: "\uD83D\uDFE1", color: "#F0B90B", nativeCurrency: "BNB" },
  { id: 43114, name: "Avalanche", icon: "\uD83D\uDD3A", color: "#E84142", nativeCurrency: "AVAX" },
  { id: 900000001, name: "NEAR", icon: "\u2B1B", color: "#000000", nativeCurrency: "NEAR" },
  { id: 900000002, name: "TON", icon: "\uD83D\uDC8E", color: "#0098EA", nativeCurrency: "TON" },
  { id: 900000003, name: "TRON", icon: "\u26A1", color: "#FF0013", nativeCurrency: "TRX" },
  { id: 1151111081099710, name: "Solana", icon: "\uD83D\uDFE2", color: "#9945FF", nativeCurrency: "SOL" },
];

export function getChainById(id: number): ChainMeta | undefined {
  return CHAINS.find((c) => c.id === id);
}

export function getChainName(id: number): string {
  return getChainById(id)?.name ?? `Chain ${id}`;
}
