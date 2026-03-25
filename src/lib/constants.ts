/**
 * Popular token addresses per chain.
 * Use the zero address (0x000...0) for native tokens on EVM chains.
 */

export const NATIVE_TOKEN = "0x0000000000000000000000000000000000000000";

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
}

export const POPULAR_TOKENS: Record<number, TokenInfo[]> = {
  // Ethereum
  1: [
    { address: NATIVE_TOKEN, symbol: "ETH", name: "Ethereum", decimals: 18 },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", name: "USD Coin", decimals: 6 },
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", name: "Tether USD", decimals: 6 },
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI", name: "Dai Stablecoin", decimals: 18 },
    { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8 },
  ],
  // Arbitrum
  42161: [
    { address: NATIVE_TOKEN, symbol: "ETH", name: "Ethereum", decimals: 18 },
    { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", symbol: "USDC", name: "USD Coin", decimals: 6 },
    { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: "USDT", name: "Tether USD", decimals: 6 },
    { address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", symbol: "DAI", name: "Dai Stablecoin", decimals: 18 },
  ],
  // Base
  8453: [
    { address: NATIVE_TOKEN, symbol: "ETH", name: "Ethereum", decimals: 18 },
    { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC", name: "USD Coin", decimals: 6 },
  ],
  // Polygon
  137: [
    { address: NATIVE_TOKEN, symbol: "MATIC", name: "Polygon", decimals: 18 },
    { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", symbol: "USDC", name: "USD Coin", decimals: 6 },
    { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "USDT", name: "Tether USD", decimals: 6 },
  ],
  // Optimism
  10: [
    { address: NATIVE_TOKEN, symbol: "ETH", name: "Ethereum", decimals: 18 },
    { address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", symbol: "USDC", name: "USD Coin", decimals: 6 },
    { address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", symbol: "USDT", name: "Tether USD", decimals: 6 },
  ],
  // BSC
  56: [
    { address: NATIVE_TOKEN, symbol: "BNB", name: "BNB", decimals: 18 },
    { address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", symbol: "USDC", name: "USD Coin", decimals: 18 },
    { address: "0x55d398326f99059fF775485246999027B3197955", symbol: "USDT", name: "Tether USD", decimals: 18 },
  ],
  // Avalanche
  43114: [
    { address: NATIVE_TOKEN, symbol: "AVAX", name: "Avalanche", decimals: 18 },
    { address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", symbol: "USDC", name: "USD Coin", decimals: 6 },
    { address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", symbol: "USDT", name: "Tether USD", decimals: 6 },
  ],
  // Solana
  1151111081099710: [
    { address: "11111111111111111111111111111111", symbol: "SOL", name: "Solana", decimals: 9 },
    { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", name: "USD Coin", decimals: 6 },
  ],
};

/** Default slippage percentage */
export const DEFAULT_SLIPPAGE = 0.5;

/** Placeholder wallet address for dry quotes */
export const PLACEHOLDER_ADDRESS = "0x0000000000000000000000000000000000000001";
