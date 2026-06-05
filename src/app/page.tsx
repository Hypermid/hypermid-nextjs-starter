import Image from "next/image";
import SwapForm from "@/components/SwapForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/hypermid-logo.svg"
              alt="Hypermid"
              width={140}
              height={32}
              priority
            />
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://docs.hypermid.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/hypermid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Hero text */}
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Cross-Chain Swap
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            Swap tokens across 11+ blockchains with the best rates.
            <br />
            Powered by LI.FI and Near Intents.
          </p>
        </div>

        {/* Swap form */}
        <SwapForm />

        {/* Supported chains strip */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Supported Chains
          </p>
          <div className="flex items-center justify-center gap-3 text-2xl">
            <span title="Ethereum">&#x1F537;</span>
            <span title="Arbitrum">&#x1F535;</span>
            <span title="Base">&#x1F7E6;</span>
            <span title="Polygon">&#x1F7E3;</span>
            <span title="Optimism">&#x1F534;</span>
            <span title="BSC">&#x1F7E1;</span>
            <span title="Avalanche">&#x1F53A;</span>
            <span title="Solana">&#x1F7E2;</span>
            <span title="NEAR">&#x2B1B;</span>
            <span title="TON">&#x1F48E;</span>
            <span title="TRON">&#x26A1;</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-gray-500">
          <span>Built with Hypermid SDK</span>
          <span>
            <a
              href="https://hypermid.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              hypermid.io
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
