import { NextResponse } from 'next/server';

export interface DexPair {
  id: string;
  baseToken: { symbol: string; name: string };
  quoteToken: { symbol: string; name: string };
  chain: string;
  dex: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  fdv?: number;
}

const CHAINS = ['Solana', 'Ethereum', 'BSC', 'Base', 'Arbitrum', 'Polygon'];
const DEXS = ['Raydium', 'Jupiter', 'Uniswap', 'PancakeSwap', 'Aerodrome', 'Camelot'];

function randomPair(chain: string): DexPair {
  const tokens = ['BONK', 'WIF', 'POPCAT', 'PEPE', 'DOGE', 'SHIB', 'SOL', 'ETH', 'USDC', 'JUP', 'RAY', 'JTO'];
  const base = tokens[Math.floor(Math.random() * 8)];
  const quote = tokens[Math.floor(Math.random() * 4) + 8];
  const price = Math.random() * 0.5 + 0.00001;
  const change = (Math.random() - 0.5) * 40;
  const vol = Math.random() * 1e9 + 1e5;
  const liq = Math.random() * 5e6 + 1e4;

  return {
    id: `${chain}-${base}-${quote}-${Math.random().toString(36).slice(2)}`,
    baseToken: { symbol: base, name: base },
    quoteToken: { symbol: quote, name: quote },
    chain,
    dex: DEXS[Math.floor(Math.random() * DEXS.length)],
    price,
    priceChange24h: change,
    volume24h: vol,
    liquidity: liq,
    fdv: vol * (Math.random() * 100 + 10),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain') || 'all';
  const search = searchParams.get('search') || '';

  const chains = chain === 'all' ? CHAINS : [chain];
  const pairs: DexPair[] = [];

  for (const c of chains) {
    for (let i = 0; i < 15; i++) {
      pairs.push(randomPair(c));
    }
  }

  const filtered = search
    ? pairs.filter(
        (p) =>
          p.baseToken.symbol.toLowerCase().includes(search.toLowerCase()) ||
          p.quoteToken.symbol.toLowerCase().includes(search.toLowerCase())
      )
    : pairs;

  return NextResponse.json(filtered.slice(0, 50));
}
