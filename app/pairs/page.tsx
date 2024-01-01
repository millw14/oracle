'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
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

const SORT_OPTIONS = ['Volume', 'Liquidity', 'Price Change', 'New'];

export default function PairsPage() {
  const [pairs, setPairs] = useState<DexPair[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Volume');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPairs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
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
    const i = setInterval(fetchPairs, 8000);
    return () => clearInterval(i);
  }, [search]);

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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search token symbol or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg font-mono placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-4 py-2 text-sm font-mono rounded-lg transition-all flex items-center gap-2 ${
                  sort === s ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4" />
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="bg-white/5 text-white/60 text-left">
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
                  <td colSpan={7} className="px-4 py-16 text-center text-white/40">
                    Loading pairs...
                  </td>
                </tr>
              ) : (
                pairs.map((p) => (
                  <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <Link href={`/pair/${p.id}`} className="hover:text-emerald-400">
                        {p.baseToken.symbol}
                        <span className="text-white/40">/</span>
                        {p.quoteToken.symbol}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-white/70">{p.chain}</td>
                    <td className="px-4 py-3 text-white/70">{p.dex}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={p.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {p.priceChange24h >= 0 ? <TrendingUp className="w-3 h-3 inline mr-0.5" /> : <TrendingDown className="w-3 h-3 inline mr-0.5" />}
                        {p.priceChange24h >= 0 ? '+' : ''}{p.priceChange24h.toFixed(2)}%
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
      </div>
    </div>
  );
}
