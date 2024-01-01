'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { BarChart3, ArrowLeft, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PairDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pair, setPair] = useState<any>(null);

  useEffect(() => {
    const fetchPair = async () => {
      try {
        const res = await fetch(`/api/pairs?search=${params.id}`);
        const data = await res.json();
        setPair(data[0] || {
          id: params.id,
          baseToken: { symbol: 'TOKEN', name: 'Token' },
          quoteToken: { symbol: 'USDC', name: 'USD Coin' },
          chain: 'Solana',
          dex: 'Raydium',
          price: 0.001234,
          priceChange24h: 12.5,
          volume24h: 1234567,
          liquidity: 500000,
        });
      } catch {
        setPair({
          id: params.id,
          baseToken: { symbol: 'TOKEN', name: 'Token' },
          quoteToken: { symbol: 'USDC', name: 'USD Coin' },
          chain: 'Solana',
          dex: 'Raydium',
          price: 0.001234,
          priceChange24h: 12.5,
          volume24h: 1234567,
          liquidity: 500000,
        });
      }
    };
    fetchPair();
  }, [params.id]);

  if (!pair) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-white/60 font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-mono text-xl font-bold">DexRadar</span>
          </Link>
          <WalletMultiButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white font-mono text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to pairs
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-mono font-bold">
                {pair.baseToken.symbol} / {pair.quoteToken.symbol}
              </h1>
              <span className="text-emerald-400 font-mono text-sm">{pair.chain} • {pair.dex}</span>
            </div>

            <div className="text-3xl font-mono font-bold mb-2">
              $ {pair.price >= 0.0001 ? pair.price.toFixed(6) : pair.price.toExponential(4)}
            </div>
            <div className={`text-sm font-mono ${pair.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {pair.priceChange24h >= 0 ? '+' : ''}{pair.priceChange24h.toFixed(2)}% (24h)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-white/60 text-xs font-mono mb-1">24h Volume</div>
              <div className="font-mono">${(pair.volume24h / 1e6).toFixed(2)}M</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-white/60 text-xs font-mono mb-1">Liquidity</div>
              <div className="font-mono">${(pair.liquidity / 1e3).toFixed(2)}K</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-64 flex items-center justify-center">
            <div className="text-white/40 font-mono text-sm text-center">
              Chart placeholder • Price history coming soon
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="#"
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-center rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Trade on {pair.dex} <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/pairs"
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-center rounded-lg transition-colors"
            >
              View all pairs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
