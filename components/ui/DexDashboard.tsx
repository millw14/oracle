'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

interface DexPair {
  id: string;
  baseToken: { symbol: string; name: string };
  quoteToken: { symbol: string; name: string };
  chain: string;
  dex: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
}

const CHAINS = ['All', 'Solana', 'Ethereum', 'BSC', 'Base', 'Arbitrum', 'Polygon'];

export default function DexDashboard() {
  const [pairs, setPairs] = useState<DexPair[]>([]);
  const [chain, setChain] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPairs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (chain !== 'All') params.set('chain', chain);
        if (search) params.set('search', search);
        const res = await fetch(`/api/pairs?${params}`);
        const data = await res.json();
        setPairs(data);
      } catch (e) {
        setPairs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPairs();
    const i = setInterval(fetchPairs, 10000);
    return () => clearInterval(i);
  }, [chain, search]);

  const formatNum = (n: number) => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    return n.toFixed(2);
  };

  const formatPrice = (p: number) => {
    if (p >= 1) return p.toFixed(4);
    if (p >= 0.0001) return p.toFixed(6);
    return p.toExponential(2);
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-mono text-xl font-bold tracking-tight text-white">
              DexRadar
            </span>
            <span className="text-[10px] text-white/40 font-mono hidden sm:inline">DEX Analytics</span>
          </Link>

          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search tokens or pairs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-mono placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pairs"
              className="text-sm font-mono text-white/70 hover:text-white transition-colors hidden sm:flex items-center gap-1"
            >
              All Pairs <ChevronRight className="w-4 h-4" />
            </Link>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      {/* Chain Tabs */}
      <div className="border-b border-white/10 bg-[#161b22]/50">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {CHAINS.map((c) => (
              <button
                key={c}
                onClick={() => setChain(c)}
                className={`px-4 py-2 text-sm font-mono shrink-0 transition-all ${
                  chain === c
                    ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-white/10 py-3">
        <div className="container mx-auto px-4 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-white/60 font-mono">50+ chains</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-white/60 font-mono">100+ DEXs aggregated</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-white/60 font-mono">Real-time data</span>
          </div>
        </div>
      </div>

      {/* Pairs Table */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-mono font-semibold">Token Pairs</h2>
          <div className="md:hidden relative w-48">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="bg-white/5 text-white/60 text-left">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Pair</th>
                <th className="px-4 py-3">Chain</th>
                <th className="px-4 py-3">DEX</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">24h %</th>
                <th className="px-4 py-3">24h Volume</th>
                <th className="px-4 py-3">Liquidity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-white/40">
                    Loading pairs...
                  </td>
                </tr>
              ) : (
                pairs.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-white/40">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/pair/${p.id}`} className="hover:text-emerald-400 transition-colors">
                        {p.baseToken.symbol}
                        <span className="text-white/40">/</span>
                        {p.quoteToken.symbol}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-white/70">{p.chain}</td>
                    <td className="px-4 py-3 text-white/70">{p.dex}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }
                      >
                        {p.priceChange24h >= 0 ? (
                          <TrendingUp className="w-3 h-3 inline mr-0.5" />
                        ) : (
                          <TrendingDown className="w-3 h-3 inline mr-0.5" />
                        )}
                        {p.priceChange24h >= 0 ? '+' : ''}
                        {p.priceChange24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/70">${formatNum(p.volume24h)}</td>
                    <td className="px-4 py-3 text-white/70">${formatNum(p.liquidity)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-white/40 font-mono text-center">
          Real-time DEX analytics • Alternative to DexScreener • No registration required
        </p>
      </div>
    </main>
  );
}
