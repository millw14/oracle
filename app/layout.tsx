import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/components/SolanaProvider";
import '@solana/wallet-adapter-react-ui/styles.css';

export const metadata: Metadata = {
  title: "DexRadar - Real-Time DEX Analytics",
  description: "Track live prices, liquidity, and market data across 50+ DEXs. Your alternative to DexScreener.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
