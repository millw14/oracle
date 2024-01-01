# DEX Data Integration Guide

## Overview

This guide explains how to integrate real-time DEX data into DexRadar. Currently using mock data - connect to live DEX APIs for production.

## Recommended Data Sources

### 1. **DexScreener API** (Unofficial)
- Public endpoint for pair data
- Multi-chain support
- Use for reference only - terms may restrict

### 2. **GeckoTerminal**
- URL: https://www.geckoterminal.com/dex-api
- Free tier available
- Multi-chain DEX data

### 3. **Birdeye API** (Solana)
- URL: https://docs.birdeye.so/
- Solana-focused
- Token prices, analytics

### 4. **Moralis / Covalent**
- Multi-chain blockchain data
- DEX pool queries

## Implementation

Update `app/api/pairs/route.ts` to fetch from your chosen API. Replace mock data with real API calls.

## Environment Variables

```env
# Add to .env.local
DEX_API_KEY=your_api_key
BIRDEYE_API_KEY=your_birdeye_key  # For Solana
```

## License

MIT
