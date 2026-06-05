# Hypermid Next.js Starter

A ready-to-deploy Next.js app demonstrating **Hypermid** integration -- a cross-chain swap interface with fiat on-ramp, built using the `@hypermid/sdk` TypeScript SDK.

Swap tokens across 11+ blockchains (Ethereum, Arbitrum, Base, Polygon, Optimism, BSC, Avalanche, Solana, NEAR, TON, TRON) with the best rates via LI.FI and Near Intents.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhypermid%2Fhypermid-nextjs-starter&env=HYPERMID_API_KEY&envDescription=Your%20Hypermid%20API%20key&project-name=hypermid-swap&repository-name=hypermid-swap)

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/hypermid/hypermid-nextjs-starter.git
cd hypermid-nextjs-starter

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Hypermid API key

# 3. Install dependencies and run
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Screenshots

<!-- Add screenshots of your app here -->
_Coming soon_

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (dark theme)
- **@hypermid/sdk** -- Hypermid TypeScript SDK

## Project Structure

```
src/
  app/
    layout.tsx              Root layout with Tailwind, dark theme
    page.tsx                Landing page with swap form
    api/
      quote/route.ts        Server-side quote proxy (hides API key)
      execute/route.ts      Server-side execute proxy
      status/route.ts       Server-side status proxy
      onramp/checkout/      Server-side onramp checkout proxy
  components/
    SwapForm.tsx            Token/chain selector, amount input, quote display
    QuoteDisplay.tsx        Shows quote details (rate, fees, time)
    StatusTracker.tsx       Polls status, shows step progress
    ChainSelector.tsx       Dropdown with chain icons
    TokenInput.tsx          Token amount input with decimals
    OnrampButton.tsx        "Buy with card" button via RampNow
  lib/
    hypermid.ts             Server-side Hypermid client instance
    chains.ts               Chain metadata (names, icons, colors)
    constants.ts            Popular token addresses per chain
  hooks/
    useQuote.ts             Debounced quote fetching (500ms)
    useSwapStatus.ts        Polls swap status with interval
```

## Key Features

- **Cross-chain swaps** -- Select source/destination chains and tokens, get real-time quotes, execute swaps
- **Server-side API proxy** -- All Hypermid API calls go through Next.js API routes, keeping your API key server-side
- **Debounced quotes** -- Quotes are fetched with 500ms debouncing to reduce API calls
- **Status tracking** -- Visual step-by-step progress (Initiated, Processing, Complete)
- **Fiat on-ramp** -- Buy crypto with a credit card via RampNow checkout
- **Dark theme** -- Clean dark UI inspired by modern DEX interfaces

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HYPERMID_API_KEY` | Your Hypermid API key (server-side) | Yes |
| `NEXT_PUBLIC_HYPERMID_API_KEY` | Public API key (optional, for client display) | No |

Get your API key at [hypermid.io](https://hypermid.io).

## Customization

### Adding more chains

Edit `src/lib/chains.ts` to add or remove chains from the dropdown. The full list of supported chain IDs is available in `@hypermid/sdk` via the `ChainId` constant.

### Adding more tokens

Edit `src/lib/constants.ts` to add popular token addresses for each chain. These appear in the token selector dropdown.

### Styling

The app uses Tailwind CSS with custom color tokens defined in `tailwind.config.ts`:

- `surface` -- Background surfaces (dark grays)
- `accent` -- Primary action color (purple)
- `border` -- Border color

### Integrating a wallet

This starter uses manual address input. To integrate a wallet connector (e.g., RainbowKit, wagmi, Web3Modal):

1. Install your wallet library
2. Replace the address input fields in `SwapForm.tsx` with the connected wallet address
3. For LI.FI routes, sign the `transactionRequest` returned by the execute API
4. For Near Intents routes, send tokens to the `depositAddress`

## API Routes

All API routes proxy to the Hypermid API at `https://api.hypermid.io`:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/quote` | GET | Get a swap quote |
| `/api/execute` | POST | Execute a swap |
| `/api/status` | GET | Check swap status |
| `/api/onramp/checkout` | POST | Create on-ramp checkout session |

## Learn More

- [Hypermid Documentation](https://docs.hypermid.io)
- [Hypermid SDK on npm](https://www.npmjs.com/package/@hypermid/sdk)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
