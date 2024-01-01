# DexRadar Setup

## Prerequisites

- Node.js 18+
- npm or yarn

## Install

```bash
npm install
npm run dev
```

## Project Structure

```
dexradar/
├── app/
│   ├── api/pairs/     # DEX pairs API
│   ├── pair/[id]/     # Pair detail page
│   ├── pairs/         # All pairs page
│   └── page.tsx       # Dashboard
├── components/
│   └── ui/
│       └── DexDashboard.tsx
└── lib/
```

## Tech Stack

- Next.js 15, TypeScript, Tailwind
- Solana Wallet Adapter
